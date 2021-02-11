'use strict';
var UglifyJS = require('uglify-js');
var util = require('./util');

/**
 * Parses doctest examples from a string.
 *
 * @param {String} input
 * @return {Array} examples
 */

exports.run = function commentParser$run(input) {
  return exports.parseExamples(exports.parseComments(input));
};

/**
 * Parses comments and code from a string. Heavily inspired by the code in @tj's
 * `dox` module
 *
 * @param {String} input
 * @return {Array} parsed
 */

exports.parseComments = function commentParser$parseComments(input) {
  input = input.replace(/\r\n/gm, '\n');
  var nodes = [];

  var insideSinglelineComment = false;
  var insideMultilineComment  = false;

  var currentNode = { type: 'code', string: '', };


  for(var i = 0, len = input.length; i < len; i += 1) {
    if(insideMultilineComment) {
      if(input[i] === '*' && input[i + 1] === '/') {
        flush();
        insideMultilineComment = false;
        i += 1;
        continue;
      }
    }
    else if(insideSinglelineComment) {
      if(input[i] === '\n') {
        flush();
        insideSinglelineComment = false;
        continue;
      }
    }
    else if(input[i] === '/') {
      if(input[i + 1] === '*') {
        flush();
        currentNode.type = 'comment';
        insideMultilineComment = true;
        i += 1;
        continue;
      }
      else if(input[i + 1] === '/') {
        flush();
        currentNode.type = 'comment';
        insideSinglelineComment = true;
        i += 1;
        continue;
      }
    }

    currentNode.string += input[i];
  }

  flush();
  return nodes;

  function flush() {
    currentNode.string = util.trimString(currentNode.string);
    nodes.push(currentNode);
    currentNode = { type: 'code', string: '', };
  }
};

/**
 * Parses `jsdoc` "examples" for our doctests out of the parsed comments.
 *
 * @param {Array} parsedComments Parsed output from `parseComments`
 * @return {Array} parsedExamples
 */

exports.parseExamples = function commentParser$parseExamples(parsedComments) {
  var examples = [];
  var currentExample = { expectedResult: '', };
  var caption;
  var currentCaption;

  for(var i = 0, len = parsedComments.length; i < len; i++) {
    if(parsedComments[i].type === 'code' && parsedComments[i].string) {
      if(currentExample.testCase) flush();

      currentExample.testCase = parsedComments[i].string
        //.replace(/\n/g, ';')
        .replace(/^<caption>.+<\/caption>\s*/, '')
        .replace(/;$/, '');
      currentExample.displayTestCase = parsedComments[i].string
        .replace(/\n/g, ';')
        .replace(/^<caption>.+<\/caption>\s*/, '')
        .replace(/;$/, '');

      currentCaption = parsedComments[i].string
        .match(/^<caption>(.+)<\/caption>/);
      if (currentCaption && currentCaption[1]) {
        caption = currentCaption[1];
      }

      if (caption) {
        currentExample.label =
          currentExample.testCase + ' - ' + caption;
      }
    } else if(parsedComments[i].type === 'comment' && currentExample.testCase) {
      if(parsedComments[i].string.indexOf('=>') === 0) {
        currentExample.expectedResult += parsedComments[i].string.slice(3);
      } else if(parsedComments[i].string.indexOf('async =>') === 0) {
        currentExample.expectedResult += parsedComments[i].string.slice(9);
        currentExample.isAsync = true;
      }
    }
  }

  flush();

  return examples;

  function flush() {
    if(currentExample.expectedResult) {
      examples.push(currentExample);
    }

    currentExample = { expectedResult: '', };
  }
};
