import ExtendableError from 'es6-error';

export default class ValidationError extends ExtendableError {
  constructor(result) {
    super();

    this.validation = result;
  }
}
