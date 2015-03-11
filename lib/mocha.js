'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var jsdoctest = require('./index');
var getExampleCode = require('./get-example-code');
var util = require('./util');

var escapeString = getExampleCode.escapeString;

/**
 * Mocks `mocha`'s register environment for doctest mocha integration. This
 * works in the same manner `coffee-script/register` or `mocha --require
 * blanket` work.
 */

exports.loadDoctests = function loadDoctests(module, filename) {
  require('should');
  var rootDir = process.cwd();

  var content = fs.readFileSync(filename, 'utf8');
  var mochaSpec = exports.contentsToMochaSpec(rootDir, filename, content);

  module._compile(util.stripBOM(content + mochaSpec), filename);
};

/**
 * Compiles a string containing the contents of a JSDoc annotated file and
 * outputs the generated mocha spec for its JSDocTests.
 */

exports.contentsToMochaSpec =
function contentsToMochaSpec(rootDir, filename, content) {
  var comments = jsdoctest.getJsdoctests(content);
  var moduleName = exports._getModuleName(rootDir, filename, comments.source);

  return '\ndescribe(\'' + escapeString(moduleName) + '\', function() {' +
             _.map(_.compact(comments), function(comment) {
               return exports.commentToMochaSpec(comment);
             }).join('') +
         '});';
};

/**
 * Compiles a jsdoc comment parsed by `dox` and its doctest examples into a
 * mocha spec.
 */

exports.commentToMochaSpec = function commentToMochaSpec(comment) {
  var ctx = comment.ctx || {};
  return '\ndescribe(\'' + escapeString(ctx.string) + '\', function() {' +
     _.map(comment.examples, function(example) {
       return 'it(\'' + escapeString(example.testCase) +
              '\', function(' + (example.isAsync ? 'done' : '') + ') {' +
              getExampleCode(example) +
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
  if(originalLoad) {
    require.extensions['.js'] = originalLoad;
  } else {
    originalLoad = originalLoad || require.extensions['.js'];
    require.extensions['.js'] = function(module, filename) {
      if(!module.parent.id.match(/node_modules\/mocha\/lib\/mocha.js$/)) {
        return originalLoad(module, filename);
      }

      return exports.loadDoctests(module, filename);
    };
  }
};

/**
 * Resolves the expected module name for a given file, to use as the top-level
 * spec when generating mocha doctest `describes`
 *
 * @param {String} The root directory
 * @param {String} The module's filename
 * @return {String} moduleName
 */

exports._getModuleName = function getModuleName(rootDir, filename, parsedContent) {
  var moduleBlock = _.find(parsedContent, function(block) {
    return block.tags && _.find(block.tags, { type: 'module' });
  });
  if(moduleBlock) {
    var moduleTag = _.find(moduleBlock.tags, { type: 'module' });
    if(moduleTag && moduleTag.string) {
      var smoduleTag = moduleTag.string.split(' ');
      if(smoduleTag[0].charAt(0) === '{' && !!smoduleTag[1]) return smoduleTag[1];
      else if(!!smoduleTag[0]) return smoduleTag[0];
    }
  }


  var filenamePrime = path.relative(rootDir, filename);
  return stripExtension(filenamePrime);

  function stripExtension(f) {
    return f.replace(/\..+$/, '');
  }
};
