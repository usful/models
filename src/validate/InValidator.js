export default function inValidator(values, message) {
  if (!Array.isArray(values)) {
    throw new Error('An array of values must be provided to the InValidator.');
  }

  message = message || `Value must be one of ${values.join(',')}`;

  return {
    validate: function(value) {
      return values.includes(value);
    },
    message: message,
    name: 'InValidator',
    args: ['values'],
    values: values
  };
};