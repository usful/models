import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {

    //Remove reference to __parent on the model being replaced to avoid memory leaks.
    if (this.__data[key]) {
      this.__data[key].__parent = null;
      this.__data[key].__parentKey = null;
    }

    if (nullCheck(this, key, val, def)) return;

    //Check to make sure the value being set is the correct Model, if not, cast it.
    let next = (val.constructor.isModel) ? val : new def.type(val);

    next.__parent = this;
    next.__parentKey = key;

    this.__data[key] = next;
    this.__onChanged(key, next);
  };
}