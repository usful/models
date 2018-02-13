import Validation from './Validation';
import ValidationError from './ValidationError';

function ValidationMiddleware (model) {
  model.prototype.validate = function() {
    const result = {
      props: {},
      messages: {}
    };

    const props = this.constructor.def.props.filter(
      prop => prop.validators && prop.validators.length > 0
    );

    this.__isValid = true;

    props.forEach(prop => {
      //Required is a special validator, so we will check to see if its in the list.
      const isRequired = prop.validators.some(
        validator => validator === Validation.required
      );

      const hasValue = Validation.required.validate.call(
        this,
        this.__data[prop.key]
      );

      if (isRequired && !hasValue) {
        //If required validation failed, no need to continue.
        this.__isValid = false;
        result.props[prop.key] = false;
        result.messages[prop.key] = Validation.required.message;
        return;
      } else if (!isRequired && !hasValue) {
        //If something is not required, and it has no value, it is technically valid.
        result.props[prop.key] = true;
        return;
      } else {
        result.props[prop.key] = true;
      }

      prop.validators.forEach(validator => {
        if (validator === Validation.required) {
          return;
        }

        result.props[prop.key] = validator.validate.call(this, this.__data[prop.key]);

        if (!result.props[prop.key]) {
          this.__isValid = false;
          result.messages[prop.key] = validator.message;
        }
      });
    });

    if (!this.__isValid) {
      throw new ValidationError(result);
    }

    return this.__isValid;
  };


  //Setup the getters and setter for this guy.
  Object.defineProperty(model.prototype, 'isValid', {
    get: function() {
      return !!this.__isValid;
    }
  });
}

ValidationMiddleware.validators = Validation;
ValidationMiddleware.ValidationError = ValidationError;

export default ValidationMiddleware;
