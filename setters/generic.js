export default function setter(key, def) {
  return function (val) {
    this.__changing(key, val);
    this.__data[key] = val;
  };
}