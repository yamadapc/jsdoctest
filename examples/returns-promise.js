var Promise = require('bluebird');

/**
 * @example
 *   resolvesAPromise() // async => 10
 */

function resolvesAPromise() {
  return new Promise(function(resolve) {
    resolve(10);
  });
}

/**
 * @example
 *   rejectsAPromise() // async => 'doesn\'t matter'
 */

function rejectsAPromise() {
  return new Promise(function(resolve, reject) {
    reject(new Error('Blowing-up stuff'));
  });
}
