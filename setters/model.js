import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {

    //TODO: potential memory leak when type is a Model because of the __parent reference.
    if (nullCheck(this, key, val)) return;

    //Check to make sure the value being set is the correct Model, if not, cast it.
    let obj = (val.constructor === def.type) ? val : new def.type(val);

    obj.__parent = this;
    obj.__parentKey = key;

    this.__changing(key, obj);

    //if setting to a model null, or removing a reference to that Model, the _parent property must be cleared on
    //that instance. Otherwise, they will still retain a reference to another object and may not be garbage
    //collected as expected.

    if (this.__data[key]) {
      this.__data[key].__parent = null;
    }

    this.__data[key] = obj;
  };
}