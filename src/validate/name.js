export default {
  validate: function(value) {
    return /[A-Za-z\d]{2,}/.test(value);
  },
  message: 'You have to enter a name.'
};