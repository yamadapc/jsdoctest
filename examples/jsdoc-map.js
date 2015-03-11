/**
 * @example
 *   map([1, 2, 3], function(i) {
 *     return i + 10
 *     20
 *   });
 *   // => [11, ]
 */

function map(arr, fn) {
  var ret = [];

  for(var i = 0, len = arr.length; i < len; i++) {
    var el = fn(arr[i]); // O map de verdade seria `fn(arr[i], i, arr)`
    ret.push(el);
  }

  return ret;
}
