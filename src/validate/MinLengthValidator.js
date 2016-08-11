export default function(minLength, message = null) {
  if (typeof minLength !== 'number') {
    throw new Error('minLength must be provided and must be a number');
  }

  message = message || `Value length must be at least ${minLength}`;

  return {
    validate: function(value) {
      return value && value.length >= minLength;
    },
    message: message
  };
};