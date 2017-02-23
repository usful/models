export default {
  validate: function(value) {
    return value !== null && value !== undefined;
  },
  message: 'This field is required.',
  name: 'required'
};