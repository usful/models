export default {
  validate: function(value) {
    return /^[A-Za-z\d]{6,}$/.test(value);
  },
  message: 'You have to enter a password that is at least 6 letters.'
};