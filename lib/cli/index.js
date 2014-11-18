'use strict';
var child = require('child_process');
var fs = require('fs');
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
    .usage('[options] [FILES...]')
    .option('-i, --init', 'Sets-up your package.json file to use `jsdoctest`')
    .version(packageJson.version);

  program.parse(argv);

  if(program.init) {
    return exports._init();
  }

  if(program.args.length === 0) {
    return program.help();
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
 * Sets-up the project on the CWD to use `jsdoctest`.
 */

exports._init = function init() {
  var cwd = process.cwd();
  var pkgJsonPth = path.join(cwd, 'package.json');

  if(!fs.existsSync(pkgJsonPth)) {
    exports._fail('Couldn\'t find local package.json file.');
  }

  var json = require(pkgJsonPth);
  if(!json.scripts) json.scripts = {};
  if(json.scripts.test) json.scripts.test += ' && ';
  json.scripts.test += 'npm run jsdoctest';
  json.scripts.jsdoctest =
    'mocha --require jsdoctest `find lib src source -name "*.js"`';

  console.log('Adding `jsdoctest` script to your package.json...');
  fs.writeFileSync(pkgJsonPth, JSON.stringify(json, null, 2));

  console.log('Installing `mocha` and `jsdoctest` with npm:');
  var c = child.spawn('npm', ['install', '--save-dev', 'mocha', 'jsdoctest']);
  c.stdout.pipe(process.stdout);
  c.stderr.pipe(process.stderr);

  c.on('error', function(err) {
    exports._fail(err);
  });

  c.on('exit', function(code) {
    if(code !== 0) {
      return exports._fail('npm exited with non-zero exit code ' + code);
    }

    console.log(
      'You can now run doctests with `npm run jsdoctest` or `npm test`'
    );
  });
};

/**
 * Prints an error to stderr and exits.
 */

exports._fail = function fail(err) {
  console.error(err.message || err);
  process.exit(err.code || 1);
};
