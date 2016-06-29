import ObservableArray from '../ObservableArray';
import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val)) return;

    for (let i=0; i<val.length; i++) {
      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== Number)
        val[i] = Number.parseFloat(val[i]);
    }

    val = ObservableArray.setup(this, key, val);

    this.__changing(key, val);
    this.__data[key] = val;
  };
}