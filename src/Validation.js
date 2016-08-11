"use strict";
import EmailValidator from './validate/EmailValidator';
import RegexValidator from './validate/RegexValidator';
import MaxLengthValidator from './validate/MaxLengthValidator';
import MinLengthValidator from './validate/MinLengthValidator';
import MatchValidator from './validate/MatchValidator';
import required from './validate/required';
import empty from './validate/empty';

export default {
  // Validator types
  // With inspiration from Django Form and Field Validators
  // Validator types are NOT true classes, no need to use "new"
  // Some validator types have been aliased for convenience
  EmailValidator: EmailValidator,
  RegexValidator: RegexValidator,
  MaxLengthValidator: MaxLengthValidator,
  MinLengthValidator: MinLengthValidator,
  MatchValidator: MatchValidator,
  equalTo: MatchValidator,
  minLength: MinLengthValidator,
  maxLength: MaxLengthValidator,
  regex: RegexValidator,
  email: EmailValidator(),
  phoneNumber: RegexValidator(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/, '', "Please enter a valid phone number."),
  required: required,
  empty: empty,
  // ValidatorOption Flags
  isRequired: 'isRequired', // Convenience flag
  isOptional: 'isOptional',
  validateImmediate: 'validateImmediate',
  crossValidateImmediate: 'crossValidateImmediate',
  
  /**
   * Determines if a validator is in the expected structure
   * @param val Validator to check
   * @returns {boolean} Whether validator is defined
   */
  isValidValidator: function (val) {
    //TODO: Do we need to be more defensive than this?
    return (val && val.validate && val.message)
  },
  /**
   * Gets a list of predefined Model validationOption's
   * @returns {Array}
   */
  getValidationOptions: function () {
    let validationOptions = [];

    for (let validationOption in this) {
      if (!this.hasOwnProperty(validationOption))
        continue;
      
      let val = this[validationOption];

      if (val === Function) {
        continue;
      }

      if (val.constructor === String) {
        validationOptions.push(val);
      }
    }
    return validationOptions
  },
  /**
   * Determines if a validationOption is one of the defined options
   * @param val Option to check
   * @returns {boolean} Whether option is defined
   */
  isValidValidationOption: function (val) {
    return this.getValidationOptions().some( option => option === val );
  },
  
}