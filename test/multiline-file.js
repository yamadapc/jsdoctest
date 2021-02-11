/**
 * @example
 *   subtract(1, 2)
 *   // => { normal: -1, reverse: 1 }
 *
 *   subtract(1, 2)
 *   // => {
 *   // =>   normal: -1,
 *   // =>   reverse: 1
 *   // => }
 *
 *   subtract(3, 6)
 *   // => { normal: -3, reverse: 3 }
 */

function subtract(x, y) {
  return {
    normal: x - y,
    reverse: y - x
  };
}
