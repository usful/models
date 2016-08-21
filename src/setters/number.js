import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val, def)) return;

    let next = (val.constructor === Number) ? val : parseFloat(val);

    //Check for NaN, isNaN is too slow
    if (next !== next) {
      next = (def.auto !== undefined) ? def.auto : undefined;
    }

    this.__data[key] = next;
    this.__onChanged(key, next);
  };
}