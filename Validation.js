"use strict";
import email from './validate/email';
import password from './validate/password';
import confirmPassword from './validate/confirmPassword';
import name from './validate/name';
import phoneNumber from './validate/phoneNumber'
import required from './validate/required';
import empty from './validate/empty';

export default {
  // Validator types
  /*
   * BEFORE MAKING ANY CHANGES
   *   Analyze how the getValidators function works
   * Each validator must be able to define
   * a) A function to be used to validate (validate)
   * b) A message to display on invalid input (message)
   * Each validationOption must be a string
   * */
  email: email,
  password: password,
  confirmPassword: confirmPassword,
  name: name,
  phoneNumber: phoneNumber,
  required: required,
  empty: empty,
  // ValidatorOption Flags
  isRequired: 'isRequired', // Convenience flag
  isOptional: 'isOptional',
  validateImmediate: 'validateImmediate',
  crossValidateImmediate: 'crossValidateImmediate',
  /**
   * Gets a list of predefined Model field validators
   * @returns {Array}
   */
  getValidators: function() {
    // Compiles an array of all the validators set on this object
    let validators = [];
    for (let validator in this) {
      // Go through each property in this object
      // Only pull out fully defined validators
      if (!this.hasOwnProperty(validator))
        continue;

      let val = this[validator];
      if (val === Function)
        continue;
      if (val.validate && val.message)
        validators.push(val);
    }

    return validators;
  },
  /**
   * Determines if a validator is one of the defined validators
   * @param val Validator to check
   * @returns {boolean} Whether validator is defined
   */
  isValidValidator: function (val) {
    // Check if validator is a defined validator
    return this.getValidators().some( validator => validator === val );
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
      if (val === Function)
        continue;
      if (val.constructor === String)
        validationOptions.push(val);
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

  /**
   * Creates a new modelValidation function to be added as an instance method
   * to a model definition. The callback is run in the context of the model
   * @param {function} cbFunction Callback function to be used.
   * @param {String[]} [keys] A list of keys to be passed to the callback function. 
   *                          Keys are passed in order to the arguments.
   * @param [validationOptions] A list of validation options. Add validationImmediate
   *                            to validate immediately after a key from keys is changed.
   * @returns {function}
   */
  createModelValidator: function (cbFunction, keys, validationOptions) {
    let modelValidator = cbFunction;

    modelValidator.isModelValidator = true;

    if (!Array.isArray(keys))
      keys = [keys];

    modelValidator.keys = keys;
    
    if (!Array.isArray(validationOptions))
      validationOptions = [validationOptions];
    if (!validationOptions.every( option => this.getValidationOptions().includes(option)))
      console.warn('Invalid model validation options defined');

    modelValidator.validationOptions = validationOptions;
    modelValidator.validate = () => true;

    return modelValidator;
  }
  
}