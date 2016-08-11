import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val)) return;

    let next = (val.constructor === Number) ? val : parseFloat(val);
    this.__data[key] = next;
    this.__onChanged(key, next);
  };
}