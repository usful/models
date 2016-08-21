import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val, def)) return;

    let next = (val.constructor === String) ? val : val.toString();
    this.__data[key] = next;
    this.__onChanged(key, next);
  };
}