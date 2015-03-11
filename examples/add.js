'use strict';
/**
 * @module {CommonJS} add-example
 */

/**
 * Adds two numbers
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @example
 *    add(10, 20)
 *    // => 30
 *    add(10, 50) // => 60
 *    10 + add(10, 50) // => 70
 */

function add(x, y) {
  return x + y;
}
exports.add = add;
