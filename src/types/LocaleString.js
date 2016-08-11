"use strict";

/** TODO: refactor out to support multiple locales. */
const DEFAULT_LOCALE = 'en';

export default function LocaleString(val) {
  if (!val) return val;

  //This is already a string, just return it
  if (val.constructor === String) return val;

  return val[DEFAULT_LOCALE];
}