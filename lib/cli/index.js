'use strict';
var child = require('child_process');
var fs = require('fs');
var path = require('path');
var program = require('commander');
var beautify = require('js-beautify')

var jsdoctest = require('../..');
var mocha = require('../mocha');
var packageJson = require('../../package.json');

/**
 * The main command-line utility's entry point.
 *
 * @param {Array.<String>} The `process.argv` array.
 */

exports.run = function(argv) {
  program
    .usage('[options] [FILES...]')
    .option(
      '-i, --init',
      'Sets-up your package.json file to use `jsdoctest`'
    )
    .option(
      '-s, --spec',
      'Outputs generated `mocha` specs to stdout rather than running tests'
    )
    .version(packageJson.version);

  program.parse(argv);

  if(program.init) {
    return exports._init();
  }

  if(program.args.length === 0) {
    return program.help();
  }

  if(program.spec) {
    return exports._spec(program);
  }

  // Base test running case
  for(var i = 0, len = program.args.length; i < len; i++) {
    var filename = program.args[i];
    var failed = jsdoctest.run(path.join(process.cwd(), filename));

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
 * Outputs generated mocha specs for a set of files to stdout
 */

exports._spec = function spec(program) {
  for(var i = 0, len = program.args.length; i < len; i++) {
    var rootDir = process.cwd();
    var filename = program.args[i];
    var content = fs.readFileSync(filename, 'utf8');

    console.log(
      beautify(
        mocha.contentsToMochaSpec(rootDir, filename, content),
        {
          indent_size: 2,
          wrap_line_length: 80
        }
      )
    );
  }
};

/**
 * Prints an error to stderr and exits.
 */

exports._fail = function fail(err) {
  console.error(err.message || err);
  process.exit(err.code || 1);
};
