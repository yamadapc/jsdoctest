/**
 * @example
 *    takesCallback('something', cb)
 *    // async => 'something - here'
 */

function takesCallback(something, cb) {
  cb(null, something + ' - here');
}
