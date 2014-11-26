/**
 * @example
 *    takesCallback('something', cb)
 *    // async => 'something - here'
 */

function takesCallback(something, cb) {
  cb(new Error('bad things happen'));
}
