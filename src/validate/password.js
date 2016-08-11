export default {
  validate: function(value) {
    return value && value.length > 5;
  },
  message: 'You have to enter a password that is at least 6 characters.'
};