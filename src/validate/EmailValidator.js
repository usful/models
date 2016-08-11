"use strict";
import escape from '../lib/escapeRegExp';

/**
 * Creates a validator object for emails
 * @param {(string|string[])} [whitelist=null] Domain or domains to whitelist as valid, fails if any other domain is used
 * @param {string} [message='Please enter a valid email address.'] Message to be displayed when validation fails
 * @returns {{validate: function, message: string}}
 */
export default function(whitelist = null, message = null) {
  message = message || 'Please enter a valid email address.';
  
  if (whitelist && !Array.isArray(whitelist))
    whitelist = [whitelist];
  
  let regex = '';
  
  if (whitelist) {
    let domainString = whitelist.map(escape).join('|');
    regex = new RegExp("^\\S+@(" + domainString+")$");
  }
    
  else {
    regex = /^\S+@((?=[^.])[\S]+\.)*(?=[^.])[\S]+\.(?=[^.])[\S]+$/
  }
  
  return {
    validate: function(value) {
      return value && regex.test(value);
    },
    message: message
  };
};