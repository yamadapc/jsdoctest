'use strict';
var fs = require('fs');
var dox = require('dox');
var _ = require('lodash');
var commentParser = require('./comment-parser');

/**
 * Mocks `mocha`'s register environment for doctest mocha integration. This
 * works in the same manner `coffee-script/register` or `mocha --require
 * blanket` work.
 */

exports.loadDoctests = function loadDoctests(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  var functionComments = _.filter(dox.parseComments(content), function(c) {
    return c.ctx.type === 'method' || c.ctx.type === 'function';
  });

  var comments = _.map(functionComments, function(comment) {
    var exampleNodes = _.where(comment.tags, { type: 'example' });
    var examples = _.flatten(_.map(exampleNodes, function(exampleNode) {
      return commentParser.run(exampleNode.string);
    }));

    comment.examples = examples;
    return examples.length ? comment : undefined;
  });

  content += _.map(_.compact(comments), exports.toMochaSpec).join('');
  module._compile(stripBOM(content), filename);
};

/**
 * Compiles a jsdoc comment parsed by `dox` and its doctest examples into a
 * mocha spec.
 */

exports.toMochaSpec = function toMochaSpec(comment) {
  return 'var __assert = require(\'assert\');' +
         'describe(\'' + comment.ctx.string + '\', function() {' +
         _.map(comment.examples, function(example) {
           return 'it(\'' + example.testCase + '\', function() {' +
                      '__assert(' +
                         example.testCase + '===' + example.expectedResult +
                      ');' +
                  '});';
         }).join('\n') +
         '});';
};

var originalLoad;

/**
 * Toggles doctest injection into loaded modules. That is: doctests will be
 * compiled into modules as mocha specs, whenever they're declared.
 */

exports.toggleDoctestInjection = function toggleDoctestInjection() {
  if(require.extensions['.js'] === exports.loadDoctests) {
    require.extensions['.js'] = originalLoad;
  } else {
    originalLoad = originalLoad || require.extensions['.js'];
    require.extensions['.js'] = exports.loadDoctests;
  }
};

require.extensions['.js'];

// Copied from node.js' built-in `lib/module.js` module
function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}
