'use strict';

module.exports = exports = getExampleCode;

/**
 * Compiles down an `example`. Async examples call an imaginary `done` function
 * once they're done.
 *
 * @param {Object} comment
 * @param {String} comment.testCase
 * @param {String} comment.expectedResult
 * @param {Boolean} comment.isAsync
 * @return {String}
 */

function getExampleCode(comment) {
  var expectedResult = comment.expectedResult;
  var isAsync = comment.isAsync;
  var testCase = comment.testCase;

  if(isAsync) {
    return '\nfunction cb(err, result) {' +
      'if(err) return done(err);' +
      (expectedResult === 'undefined'
          ? '(typeof result).should.eql("undefined");'
          : 'result.should.eql(' + expectedResult + ');') +
      'done();' +
    '}\n' +
    'var returnValue = ' + testCase + ';' +
    'if(returnValue && returnValue.then && typeof returnValue.then === \'function\') {' +
      'returnValue.then(cb.bind(null, null), cb);' +
    '}';
  } else {
    return expectedResult === 'undefined'
        ? '(typeof ' + testCase + ').should.eql("undefined");'
        : '(' + testCase + ').should.eql(' + expectedResult + ');';
  }
}

/**
 * Escapes a string for meta-quoting
 */

function escapeString(str) {
  return str.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'');
}

exports.escapeString = escapeString;
