export default function(maxLength, message = null) {
  if (typeof maxLength !== 'number') {
    throw new Error('maxLength must be provided and must be a number');
  }

  message = message || `Value length can be at most ${maxLength}`;

  return {
    validate: function(value) {
      return value && value.length <= maxLength;
    },
    message: message,
    name: 'MaxLengthValidator',
    args: 'maxLength',
    maxLength: maxLength
  };
};