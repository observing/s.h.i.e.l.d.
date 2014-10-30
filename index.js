'use strict';

var toString = Object.prototype.toString
  , original = require('original');

/**
 *
 * @param {String} host The received host that we need to check to see if supported.
 * @param {Array|String} list Possible origins it should match against.
 * @returns {Boolean}
 * @api public
 */
module.exports = function shield(host, list) {
  //
  // Ensure that we got a valid "host" which actually follows the origin
  // specifications from the web. This makes it easier to validate as we have
  // consistent URL structure to work against.
  //
  host = original(host);

  if ('string' === typeof list) list = list.split(/[\,|\s]+/);
  if (!Array.isArray(list)) return false;

  //
  // Do an initial fast check on the supplied list. These would be the most
  // common cases or the easiest to check.
  //
  return list.some(function some(origin) {
    //
    // The quickest match, a direct match against the returned origin or an
    // accept all the things origin.
    //
    if ('*' === origin || host === origin) return true;

    //
    // If we're given a RegExp we just want to test against against it directly.
    //
    if ('[object RegExp]' === toString.call(origin)) return origin.test(host);

    //
    // Transform the given origin in to RegExp that we can use for testing.
    //
    origin = origin.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1')
                   .replace(/\*/g, '([^\.]+)');

    //
    // Force leading.
    //
    if (origin.charAt(0) !== '^') origin = '^'+ origin;

    //
    // Force trailing.
    //
    origin = origin.replace(/(\\*)(.)$/, function replace(s, b, c){
      return c !== '$' || b.length % 2 === 1
        ? s + '$'
        : s;
    });

    return (new RegExp(origin, 'i')).test(host);
  });
};
