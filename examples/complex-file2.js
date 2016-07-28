if (typeof describe != undefined) var assert = require('assert');

/**
 * @example
 *   createResource();
 *   // async => 'something'
 *
 *   createResource().then(() => {
 *     return 'something else'
 *   });
 *   // async => 'something else'
 *
 *   createResource()
 *     .then(function(ret) {
 *       assert(ret === 'something');
 *       return 'something else'
 *     });
 *   // async => 'something else'
 *
 *   [1, 2, 3].map((x) => {
 *     const y = x + 4
 *     return y
 *   })
 *   // => [5, 6, 7]
 */

function createResource() {
  return new Promise((resolve) => {
    resolve('something');
  });
}
