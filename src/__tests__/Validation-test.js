"use strict";
jest.disableAutomock();

// TODO: Comment out the require error utils in the react-native package
// https://github.com/facebook/jest/issues/921
// TODO: react-native is not using babel-jest, and so doesn't process import statements properly
// The import gets hoisted above the disableAutomock
// https://github.com/facebook/jest/issues/770

const Validation = require('../Validation').default;

describe('Custom Email Validator Message', () => {

  const EmailValidator = Validation.EmailValidator;

  let defaultMessage = EmailValidator().message;

  let customMessage = 'Custom Message';

  it ('allows a custom message', () => {
    expect(EmailValidator(null, customMessage).message).toBe(customMessage);
  });

  it ('defaults to a default message when given null', () => {
    expect(EmailValidator(null, null).message).toBe(defaultMessage);
  });

  it ('defaults to a default message when given undefined', () => {
    expect(EmailValidator(null, undefined).message).toBe(defaultMessage);
  });

  it ('defaults to a default message when given a blank string', () => {
    expect(EmailValidator(null, '').message).toBe(defaultMessage);
  });

});

describe('General Email Validation', () => {

  const validate = Validation.email.validate;

  const goodEmails = [
    'info@monanetworks.com',
    'a@a.a',
    'a@bb.c',
    'a@b.cc',
    'a@123.com',
    '12@b.c',
    '12@a.b.c',
    'a@a.b.c',
    'a@a.123',
    'fox.hare@123.co.in',
    'big.long@email.address.museum',
    'google+123@gmail.com',
    'a.b.c.d.e@goooooooogle.gov.co.in.com'
  ];
  const badEmails = [
    '@a.a',
    'a@.123.com',
    'a@123.',
    'fox.hare@123.co.in ',
    '@.com',
    '.@.',
    '@.@',
    'com.com.com',
    '@.com.@',
    '@-@',
    'a.com',
    '.com',
    '@ com',
    '.com.c o m',
    '.c@m',
    '.@',
    '@.',
    'a'
  ];

  goodEmails.forEach( email => {
    it('validates '+ email, () => expect(validate(email)).toBe(true))
  });

  badEmails.forEach( email => {
    it('invalidates '+ email, () => expect(validate(email)).toBe(false))
  });
});

describe('Custom Email Whitelist', () => {

  const customDomains = [
    'monanetworks.com',
    'example.com',
    'boogle.co.in',
    'check.cz',
    '3.1.c'
  ];

  const validate = Validation.EmailValidator(customDomains).validate;

  const goodEmails = [
    'info@monanetworks.com',
    'air+123@monanetworks.com',
    'a.b@example.com',
    '12@boogle.co.in',
    '1.2.3@3.1.c'
  ];

  const  badDomainEmails = [
    'a@a.a',
    'a@bb.c',
    'a@b.cc',
    'a@123.com',
    '12@b.c',
    '12@a.b.c',
    'a@a.b.c',
    'a@a.123',
    'fox.hare@123.co.in'
  ];

  const badEmails = [
    '@a.a',
    'a@.123.com',
    'a@123.',
    'fox.hare@123.co.in ',
    '@.com',
    '.@.',
    '@.@',
    'com.com.com',
    '@.com.@',
    '@-@',
    'a.com',
    '.com',
    '@ com',
    '.com.c o m',
    '.c@m',
    '.@',
    '@.',
    'a'
  ];

  goodEmails.forEach( email => {
    it('validates ' + email, () => expect(validate(email)).toBe(true))
  });

  badDomainEmails.forEach( email => {
    it('invalidates ' + email, () => expect(validate(email)).toBe(false))
  });

  badEmails.forEach( email => {
    it('invalidates ' + email, () => expect(validate(email)).toBe(false))
  });
});