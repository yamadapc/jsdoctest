'use strict';
var path = require('path');
var program = require('commander');

var jsdoctest = require('../..');
var packageJson = require('../../package.json');

/**
 * The main command-line utility's entry point.
 *
 * @param {Array.<String>} The `process.argv` array.
 */

exports.run = function(argv) {
  program
    .usage('jsdoctest [FILES...]')
    .version(packageJson.version);

  program.parse(argv);

  // Base test running case
  try {
    for(var i = 0, len = program.args.length; i < len; i++) {
      var fileName = program.args[i];
      jsdoctest(path.join(process.cwd(), fileName));
    }
  } catch(err) {
    exports._fail(err);
  }
};

/**
 * Prints an error to stderr and exits.
 */

exports._fail = function fail(err) {
  console.error(err.message);
  process.exit(err.code || 1);
};
