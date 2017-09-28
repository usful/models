
function ValidationError (result) {
  this.name = 'ValidationError';
  this.message = 'Validation Failed';
  this.validation = result;
  this.stack = (new Error()).stack;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

export default ValidationError;