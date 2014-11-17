'use strict';
/**
 * Parses comments and code from a string. Heavily inspired by the code in @tj's
 * `dox` module
 *
 * @param {String} input
 * @return {Array} parsed
 */

exports.run = function commentParser$run(input) {
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
        i += 1;
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
    currentNode.string = trimString(currentNode.string);
    nodes.push(currentNode);
    currentNode = { type: 'code', string: '', };
  }
};

/**
 * Removes trailing and leading spaces from a String.
 *
 * @param {String} str
 * @return {String}
 */

var trimString = exports._trimString = function trimString(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
};
