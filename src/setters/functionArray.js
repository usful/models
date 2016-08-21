import ObservableArray from '../ObservableArray';
import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val, def)) return;

    //Because this is an array of something with a function type, we do not know if the array entries
    //are in the correct format.  So we will have to call the function again.
    //It is assumed that any function will account for this.
    let next = Array.prototype.map.call(val, item => this.constructor.def[key].type(item));

    next = ObservableArray.setup(this, key, next);

    this.__data[key] = next;
    this.__onChanged(key, next);
  };
}