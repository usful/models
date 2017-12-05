"use strict";
import RegexValidator from './validate/RegexValidator';
import MaxLengthValidator from './validate/MaxLengthValidator';
import MinLengthValidator from './validate/MinLengthValidator';
import MatchValidator from './validate/MatchValidator';
import InValidator from './validate/InValidator';
import MaxValidator from './validate/MaxValidator';
import MinValidator from './validate/MinValidator';

import integer from './validate/integer';
import required from './validate/required';
import empty from './validate/empty';


export default {
  Regex: RegexValidator,
  MaxLength: MaxLengthValidator,
  MinLength: MinLengthValidator,
  Match: MatchValidator,
  In: InValidator,
  Max: MaxValidator,
  Min: MinValidator,
  integer: integer,
  required: required,
  empty: empty
}