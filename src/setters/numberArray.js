import ObservableArray from '../ObservableArray';
import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {
    if (nullCheck(this, key, val, def)) return;

    for (let i=0; i<val.length; i++) {
      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== Number) {

        val[i] = parseFloat(val[i]);

        //Check for NaN, isNaN is too slow
        if (val[i] !== val[i]) {
          val[i] = (def.auto !== undefined) ? def.auto : undefined;
        }
      }
    }

    val = ObservableArray.setup(this, key, val);

    this.__data[key] = val;
    this.__onChanged(key, val);
  };
}