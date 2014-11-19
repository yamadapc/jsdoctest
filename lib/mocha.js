'use strict';
var fs = require('fs');
var _ = require('lodash');
var jsdoctest = require('./index');
var util = require('./util');

/**
 * Mocks `mocha`'s register environment for doctest mocha integration. This
 * works in the same manner `coffee-script/register` or `mocha --require
 * blanket` work.
 */

exports.loadDoctests = function loadDoctests(module, filename) {
  require('should');
  var content = fs.readFileSync(filename, 'utf8');
  var comments = jsdoctest.getJsdoctests(content);
  content += _.map(_.compact(comments), function(comment) {
    return exports.toMochaSpec(filename, comment);
  }).join('');
  module._compile(util.stripBOM(content), filename);
};

/**
 * Compiles a jsdoc comment parsed by `dox` and its doctest examples into a
 * mocha spec.
 */

exports.toMochaSpec = function toMochaSpec(filename, comment) {
  var ctx = comment.ctx || {};
  return '\ndescribe(\'' + ctx.string + '\', function() {' +
         _.map(comment.examples, function(example) {
           return 'it(\'' + example.testCase + '\', function() {' +
                     example.testCase +
                       '.should.eql(' + example.expectedResult + ');' +
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
    require.extensions['.js'] = exports.loadDoctests;
  }
};
