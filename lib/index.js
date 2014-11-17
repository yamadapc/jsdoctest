'use strict';
var fs = require('fs');
var dox = require('dox');
var _ = require('lodash');

exports = module.exports = runDoctests;

/**
 * Runs [js]doctests in a file
 */

function runDoctests(fileName) {
  var targetFile = fs.readFileSync(fileName).toString();
  var comments = dox.parseComments(targetFile);

  var functionComments = _.filter(comments, function(comment) {
    return comment.ctx.type === 'method' || comment.ctx.type === 'function';
  });

  _.each(functionComments, function(comment) {
    console.log('Running tests for ' + comment.ctx.string);
    runFunctionDoctests(targetFile, comment);
  });
}


function runFunctionDoctests(targetFile, comment) {
  var resultingCode = targetFile + '\nvar __assert = require(\'assert\');';

  var examples = _.where(comment.tags, { type: 'example' });
  _.each(examples, function(example) {
    // Parse the test cases
    var parsed = parseExample(example.string);

    // Generate the code for executing the test cases
    var code = _.map(parsed, function(p) {
      return '\n__assert(' + p.testCase + ' === ' +
                             p.expectedResult + ');';
    });

    resultingCode += code;
  });

  try {
    eval(resultingCode);
  } catch(err) {
    console.error(
      'Tests for ' + comment.ctx.string + ' failed:\n\t' + err.message
    );

    throw new Error('Test failure');
  }
}

/**
 * Parsees calls and results from the example blocks
 *
 * @example
 *   parseExample("add(10, 20) // => 30")
 *   // => [{ testCase: 'add(10, 20)', expectedResult: 30, }]
 *
 *   parseExample("add(10, 20) // => 30\n     add(30, 30)\n // => 60")
 *   // => [{ testCase: 'add(10, 20)', expectedResult: 30, },
 *   //     { testCase: 'add(10, 20)', expectedResult: 60, }]
 */

function parseExample(code) {
  var exampleRegex = /\s*(.+)[^(\/\/)]*\/\/ =>([^(\r|\n)]+)/g;
  var multilineRegex = /^(\s*\/\/\s*([^(\/\/)\n\r]*)+)+/g;
  var commentRegex = /\s*\/\//g;
  var results = [];

  var m; // Variable holding regexp matches
  while((m = exampleRegex.exec(code)) !== null) {
    // Trying to find multiline expectations (with an ugly hack)
    var rest = code.slice(exampleRegex.lastIndex);
    var trailingExpectedResults = multilineRegex.exec(rest);

    if(trailingExpectedResults && trailingExpectedResults[0]) {
      trailingExpectedResults = trailingExpectedResults[0]
        .replace(commentRegex, '');
    } else trailingExpectedResults = '';

    results.push({
      testCase:       trimString(m[1]), // Trim for debugging and only
      expectedResult: trimString(m[2] + trailingExpectedResults),
    });
  }

  return results;
}
exports._parseExample = parseExample;

function trimString(str) {
  return str.replace(/(^\s+)|(\s+$)/, '');
}
