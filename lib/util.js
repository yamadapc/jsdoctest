'use strict';
/**
 * Removes trailing and leading spaces from a String.
 *
 * @param {String} str
 * @return {String}
 *
 * @example
 *    trimString('   something      here     ')
 *    // => 'something      here'
 */

exports.trimString = function trimString(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
};

// Copied from node.js' built-in `lib/module.js` module
exports.stripBOM = function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};
