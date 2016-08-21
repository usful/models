export default function MinValidator(min, message) {
  if (typeof min !== 'number') {
    throw new Error('min must be provided and must be a number.');
  }

  message = message || `Value must be min ${min}`;

  return {
    validate: function(value) {
      return value >= min;
    },
    message: message,
    name: MinValidator,
    args: ['min'],
    min: min
  };
};