'use strict';
var fs = require('fs');
var path = require('path');
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
  var moduleName = exports._getModuleName(rootDir, filename);

  return '\ndescribe(\'' + moduleName + '\', function() {' +
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

/**
 * Resolves the expected module name for a given file, to use as the top-level
 * spec when generating mocha doctest `describes`
 *
 * @param {String} The root directory
 * @param {String} The module's filename
 * @return {String} moduleName
 */

exports._getModuleName = function getModuleName(rootDir, filename) {
  var filenamePrime = path.relative(rootDir, filename);
  return stripExtension(filenamePrime);

  function stripExtension(f) {
    return f.replace(/\..+$/, '');
  }
};
