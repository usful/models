export default {
  validate: function(value, comparisonValue) {
    return ( value && comparisonValue && value === comparisonValue );
  },
  message: 'Passwords do not match.'
};