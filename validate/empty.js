export default {
  validate: function(value) {
    return !Boolean(value)
  },
  message: 'This field must be empty.'
};