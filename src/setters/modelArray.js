import ObservableArray from '../ObservableArray';
import nullCheck from './nullCheck';

export default function setter(key, def) {
  return function (val) {


    //If we are overwriting an existing array, clear out any references the old models have to their parent
    //to prevent memory leaks.
    if (this.__data[key]) {
      this.__data[key].forEach(obj => {
        if (!obj) return;

        obj.__parent = null;
        obj.__parentKey = null;
      });

      this.__data[key].removeAllListeners();
    }

    if (nullCheck(this, key, val)) return;


    //Don't modify the original array.
    let arr = new Array(val.length);

    for (let i=0; i<val.length; i++) {
      if (val[i] !== undefined && val[i] !== null) {
        arr[i] = (val[i].constructor !== def.type) ? new def.type(val[i]) : val[i];
        arr[i].__parent = this;
        arr[i].__parentKey = key;
      }
    }

    let next = ObservableArray.setup(this, key, arr);

    //We need to listen for items added or removed to this array.  When they are added we need to set the parents,
    //when removed we need to removed parents.
    next.addListener(event => {
      switch (event.type) {
        case ObservableArray.EVENT_SET:
        case ObservableArray.EVENT_ADD:
          event.item.__parent = this;
          event.item.__parentKey = key;
          break;
        case ObservableArray.EVENT_REMOVE:
          event.item.__parent = null;
          event.item.__parentKey = null;
          break;
      }
    });

    this.__data[key] = next;
    this.__onChanged(key, next);
  };
}