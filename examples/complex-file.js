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
 */

function createResource() {
  return new Promise((resolve) => {
    resolve('something');
  });
}
