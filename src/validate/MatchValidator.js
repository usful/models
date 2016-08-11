export default function(message = null) {

  message = message || 'Values do not match';

  return {
    validate: function(value, comparisonValue) {
      return ( value && comparisonValue && value === comparisonValue );
    },
    message: message
  };
};