'use strict'; /* global describe, it */
var path = require('path');
var should = require('should');
var mocha = require('../lib/mocha');

describe('jsdoctest/mocha', function() {
  describe('.loadDoctests(module, filename)', function() {
    it('loads jsdoctests from a file and append them as mocha specs', function() {
      var called = false;
      var mockModule = {
        _compile: onCompile
      };

      mocha.loadDoctests(mockModule, path.join(__dirname, 'test-file.js'));

      function onCompile(content, filename) {
        content.should.containEql(
        '\ndescribe(\'add()\', function() {' +
            'it(\'add(1, 2)\', function() {' +
              '(add(1, 2)).should.eql(3);' +
            '});' +
          '});'
        );
        called = true;
        filename.should.equal(path.join(__dirname, 'test-file.js'));
      }

      called.should.be.true;
    });

    it('handles <caption>s in @example tags', function() {
      var called = false;
      var mockModule = {
        _compile: onCompile
      };

      mocha.loadDoctests(mockModule, path.join(__dirname, 'test-file-captioned.js'));

      function onCompile(content, filename) {
        content.should.containEql(
        '\ndescribe(\'add()\', function() {' +
            'it(\'add(1, 2) - Integers\', function() {' +
              '(add(1, 2)).should.eql(3);' +
            '});\n' +
            'it(\'add(3, 2) - Integers\', function() {' +
              '(add(3, 2)).should.eql(5);' +
            '});\n' +
            'it(\'add(1.5, 2.5) - Doubles\', function() {' +
              '(add(1.5, 2.5)).should.eql(4);' +
            '});' +
          '});'
        );
        called = true;
        filename.should.equal(path.join(__dirname, 'test-file-captioned.js'));
      }

      called.should.be.true;
    });
  });
});
