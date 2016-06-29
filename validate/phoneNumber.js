export default {

  validate: function(value) {
    //Optional +
    //10 or more digit charactesr
    //Optional group consisting of:
    //  x or X (1, required)
    //  Digit characters (1 or more, required)
    return /^[+]?[\d]{10,}(x[\d]+)?$/.test(value);
  },
  message: 'Phone number should have 10 digits',
};