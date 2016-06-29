import ObservableArray from '../ObservableArray';
import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {

    //TODO: Possible memory leak.
    //if setting to a model null, or removing a reference to that Model, the _parent property must be cleared on
    //that instance. Otherwise, they will still retain a reference to another object and may not be garbage
    //collected as expected.

    //TODO: mv. in both this case and the single value setter, could we go through and set the __parent property to null before we do the null check? If we're getting rid of them, then we know that they won't have a reference back, and if we're assigning the same object for whatever reason it will just get the reference to __parent back (on line 17 in this function and on line 11 in the single value function)

    if (nullCheck(this, key, val)) return;

    for (let i=0; i<val.length; i++) {
      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== def.type) {
        val[i] = new def.type(val[i]);
        val[i].__parent = this;
        val[i].__parentKey = key;
      }
    }

    val = ObservableArray.setup(this, key, val);

    this.__changing(key, val);

    this.__data[key] = val;
  };
}