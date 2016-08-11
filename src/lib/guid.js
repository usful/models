const UIDCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a URL friendly, (probably) GUID (Globaly Unique ID) of given length.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random why its "probably" unique.
 *
 * @param length
 * @returns {string}
 */
export default function guid(length = 16) {
  let str = '';

  while (str.length < length) {
    str += UIDCHARS[(Math.random()*UIDCHARS.length)|0];
  }

  return str;
}
