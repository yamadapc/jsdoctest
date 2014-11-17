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
    .usage('[FILES...]')
    .version(packageJson.version);

  program.parse(argv);

  if(program.args.length === 0) {
    program.displayUsage();
    process.exit(1);
  }

  // Base test running case
  for(var i = 0, len = program.args.length; i < len; i++) {
    var fileName = program.args[i];
    var failed = jsdoctest.run(path.join(process.cwd(), fileName));

    if(failed) {
      exports._fail(new Error('Tests failed'));
    } else {
      console.log('Tests passed');
    }
  }
};

/**
 * Prints an error to stderr and exits.
 */

exports._fail = function fail(err) {
  console.error(err.message);
  process.exit(err.code || 1);
};
