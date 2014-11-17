jsdoctest
=========
[![Stories in Ready](https://badge.waffle.io/yamadapc/jsdoctest.svg?label=ready&title=Ready)](http://waffle.io/yamadapc/jsdoctest)
- - -
*Though this is an initial working version, it's a really hacky and bad
implementation, meant as a proof-of-concept. I'm just putting it online to be on
SVC and push the implementation forward.*

Parses [`jsdoc`](http://usejsdoc.org/) `@example` tags from annotated functions
and runs them as if they were doctests.

Inspired by the [doctest](https://docs.python.org/2/library/doctest.html) python
library, as well as its [doctestjs](http://doctestjs.org) javascript
implementation.

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

## License
This code is licensed under the MIT license for Pedro Tacla Yamada. For more
information, please refer to the [LICENSE](/LICENSE) file.
