import Validation from './Validation';
import ValidationError from './ValidationError';

function ValidationMiddleware (model) {
  model.prototype.validate = function() {
    const result = {};
    const props = this.constructor.def.props.filter(
      prop => prop.validators && prop.validators.length > 0
    );

    let valid = true;

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
        valid = false;
        result[prop.key] = false;
        //If required validation failed, no need to continue.
        return;
      } else if (!isRequired && !hasValue) {
        //If something is not required, and it has no value, it is technically valid.
        result[prop.key] = true;
        return;
      }

      prop.validators.forEach(validator => {
        if (validator === Validation.required) {
          return;
        }

        result[prop.key] = validator.call(this, this.__data[prop.key]);

        if (!result[prop.key]) {
          valid = false;
        }
      });
    });

    if (!valid) {
      throw new ValidationError(result);
    }

    return true;
  };
}

ValidationMiddleware.validators = Validation;
ValidationMiddleware.ValidationError = ValidationError;

export default ValidationMiddleware;