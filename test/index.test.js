'use strict'; /* global describe, it */
require('should');
var jsdoctest = require('..');

describe('jsdoctest', function() {
  describe('._parseExample(code)', function() {
    it('handles expectations on the same line as test-cases', function() {
      jsdoctest._parseExample('add(10, 20) // => 30')
          .should.eql([
            { testCase: 'add(10, 20)', expectedResult: '30', },
          ]);
    });

    it('handles multiple expectation/test-case pairs', function() {
      jsdoctest._parseExample('add(10, 20) // => 30\n     add(30, 30)\n // => 60')
          .should.eql([
            { testCase: 'add(10, 20)', expectedResult: '30', },
            { testCase: 'add(30, 30)', expectedResult: '60', },
          ]);
    });

    it('handles multiple lines of expectation comments', function() {
      jsdoctest._parseExample(
        'something()\n' +
        '// => { \n' +
        '      // "something": "here"\n' +
        '// }\n' +
        'not relevant anymore'
      )
          .should.eql([
            {
              testCase: 'something()',
              // Facing spaces don't matter, though ugly.
              expectedResult: '{  "something": "here" }'
            },
          ]);
    });
  });
});
