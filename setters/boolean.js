import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val)) return;

    let next = !!val;
    this.__changing(key, next);
    this.__data[key] = next;
  };
}