export default function setter(key, def) {
  return function (val) {
    let next = this.constructor.def[key].type(val);
    this.__changing(key, next);

    this.__data[key] = next;
  };
}