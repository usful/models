import ObservableArray from '../ObservableArray';
import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val, def)) return;

    for (let i=0; i<val.length; i++) {
      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== Date)
        val[i] = new Date(val[i]);
    }

    let next = ObservableArray.setup(this, key, val);

    this.__data[key] = next;
    this.__onChanged(key, next);
    
  };
}