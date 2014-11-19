jsdoctest
=========
[![Build Status](https://travis-ci.org/yamadapc/jsdoctest.svg)](https://travis-ci.org/yamadapc/jsdoctest)
[![Coverage Status](https://coveralls.io/repos/yamadapc/jsdoctest/badge.png)](https://coveralls.io/r/yamadapc/jsdoctest)
[![Stories in Ready](https://badge.waffle.io/yamadapc/jsdoctest.svg?label=ready&title=Ready)](http://waffle.io/yamadapc/jsdoctest)
[![Dependency Status](https://david-dm.org/yamadapc/jsdoctest.svg)](https://david-dm.org/yamadapc/jsdoctest)
[![devDependency Status](https://david-dm.org/yamadapc/jsdoctest/dev-status.svg)](https://david-dm.org/yamadapc/jsdoctest#info=devDependencies)
[![npm downloads](http://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.org/package/jsdoctest)
[![npm version](http://img.shields.io/npm/v/npm.svg)](https://www.npmjs.org/package/jsdoctest)
- - -
*Though this is an initial working version, it's a really hacky and bad
implementation, meant as a proof-of-concept. I'm just putting it online to be on
SVC and push the implementation forward.*

![demo](/jsdoctest-demo.gif)

Parses [`jsdoc`](http://usejsdoc.org/) `@example` tags from annotated functions
and runs them as if they were doctests.

Inspired by the [doctest](https://docs.python.org/2/library/doctest.html) python
library, as well as its [doctestjs](http://doctestjs.org) javascript
implementation.

## Set-up
Here's a two line set-up you can use:
```bash
$ npm i -g jsdoctest && jsdoctest --init
Adding `jsdoctest` script to your package.json...
Installing `mocha` and `jsdoctest` with npm:
# ... npm doing some work...
You can now run doctests with `npm run jsdoctest` or `npm test`
```
This will add sensible defaults to your `package.json` which you can then edit.

## Usage
The recommended way of using jsdoctest is to use it
[`mocha`](https://github.com/mochajs/mocha). That is made possible with:
```bash
npm i mocha jsdoctest
mocha --require jsdoctest <module-name>
```

There's also a rudimentary command-line interface, which can be ran with:
```bash
npm i jsdoctest
jsdoctest <module-name>
```

## Disabling
To disable running jsdoctests, while still requiring it with `mocha` (I don't
know why, but you may) you can set the `JSDOCTEST_DISABLE` environment variable
to anything (`JSDOCTEST_DISABLE=true mocha --requre...`).

## License
This code is licensed under the MIT license for Pedro Tacla Yamada. For more
information, please refer to the [LICENSE](/LICENSE) file.
