export default function(field, message = 'Values do not match') {

  return {
    validate: function(value) {
      return this[field] === value;
    },
    message: message,
    name: 'MatchValidator'
  };
};