export default {
  validate: function(value) {
    return Boolean(value);
  },
  message: 'This field is required.',
  name: 'required'
};