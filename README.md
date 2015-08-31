<p align="center">
  <img alt="jsdoctest" src="/jsdoctest.png" />
</p>
[![Build Status](https://travis-ci.org/yamadapc/jsdoctest.svg)](https://travis-ci.org/yamadapc/jsdoctest)
[![Coverage Status](https://coveralls.io/repos/yamadapc/jsdoctest/badge.png)](https://coveralls.io/r/yamadapc/jsdoctest)
[![Stories in Ready](https://badge.waffle.io/yamadapc/jsdoctest.svg?label=ready&title=Ready)](http://waffle.io/yamadapc/jsdoctest)
[![Dependency Status](https://david-dm.org/yamadapc/jsdoctest.svg)](https://david-dm.org/yamadapc/jsdoctest)
[![devDependency Status](https://david-dm.org/yamadapc/jsdoctest/dev-status.svg)](https://david-dm.org/yamadapc/jsdoctest#info=devDependencies)
[![npm downloads](http://img.shields.io/npm/dm/jsdoctest.svg)](https://www.npmjs.org/package/jsdoctest)
[![npm version](http://img.shields.io/npm/v/jsdoctest.svg)](https://www.npmjs.org/package/jsdoctest)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/yamadapc/jsdoctest?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
- - -

**jsdoctest** parses [`jsdoc`](http://usejsdoc.org/) `@example` tags from
annotated functions and runs them as if they were doctests.

Inspired by the [doctest](https://docs.python.org/2/library/doctest.html) python
library, as well as its [doctestjs](http://doctestjs.org) javascript
implementation.

## Demo

![demo](/jsdoctest-demo.gif)

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

## Test-case Format
Examples need to be valid javascript, followed by a comment with the string
` => ` prefixing the results:
```javascript
/**
 * @example
 *   returns10()
 *   // => 10
 *   returns20()
 *   // => 20
 */
```

It doesn't matter if the comment is on the same line or the next one, so the
following is also valid:
```javascript
/**
 * @example
 *   returns10() // => 10
 *   returns20()
 *   // => 20
 */
```

**Async test cases** are supported prefixing the expected results with the
` async => ` string and pretending to have the `cb` callback function.
```javascript
/**
 * @example
 *   takesCallbackAndYields10('here', cb)
 *   // async => 10
 *   takesCallbackAndYields20('here', cb)
 *   // async => 30
 */
```

**Promises** are also supported, just add the same `// async =>` prefix and be
sure not to use a variable named `cb` on your text expression.
```javascript
/**
 * @example
 *   returnsPromiseThatYields10('here')
 *   // async => 10
 */
```

**Currently async test cases are only supported when using `mocha`. See [#15](https://github.com/yamadapc/jsdoctest/issues/15)**

## Examples
The [examples](/examples) directory has a couple of examples, which may be
useful. Better documentation will be added if the project raises in complexity.

## Usage
The recommended way of using jsdoctest is to use
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
to anything (`JSDOCTEST_DISABLE=true mocha --require...`).

## License
This code is licensed under the MIT license for Pedro Tacla Yamada. For more
information, please refer to the [LICENSE](/LICENSE) file.
