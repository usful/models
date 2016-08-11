"use strict";
/**
 * A regex validator object that encapsulates a validation function and a message to be displayed on validation failure
 *  If you have a very specific use case, with a static regex pattern, consider creating your own validator type
 *  to take advantage of the gains by using regex literals
 * @param {string} [pattern=null] Regex pattern to test
 * @param {string} [flags=''] Flags to apply to regex test pattern,
 * @param {string} [message='Value does not match expected pattern'] Message associated with failure of validation
 * @returns {{validate: validate, message: string}}
 */
export default function(pattern = null, flags = '', message =  'Value does not match expected pattern') {

  let regex = (pattern.constructor !== RegExp) ? new RegExp(pattern, flags) : pattern;

  return {
    validate: function(value) {
      return value && regex.test(value);
    },
    message: message
  }
};