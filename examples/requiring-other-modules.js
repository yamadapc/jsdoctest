var _ = require('lodash');

/**
 * Runs _.map
 *
 * @example
 *   map([1, 2, 3, 4], function(x) { return x + 10; }) //=> [11, 12, 13, 14]
 */

function map(arr, fn) {
  return _.map(arr, fn);
}
