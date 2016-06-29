const SORT = 'Sort';
const ADD = 'Add';
const REMOVE = 'Remove';
const SET = 'Set';

class ObservableArrayIterator {
  constructor(array) {
    this.i = 0;
    this.array = array;
  }

  next() {
    if (this.i >= this.array.length) {
      this.i = 0;
      return {done: true};
    }

    return {done: false, value: this.array[this.i++]};
  }
}

export default class ObservableArray {
  constructor(items) {
    this._array = Array.isArray(items) ? items : new Array(items);

    for (let i = 0; i < this._array.length; i++) {
      this.defineIndexProperty(i);
    }
  }

  defineIndexProperty(index) {
    if (!(index in this)) {
      Object.defineProperty(this, index, {
        configurable: true,
        enumerable: true,
        get: function () {
          return this._array[index];
        },
        set: function (val) {
          this._array[index] = val;

          this.raiseEvent({
            array: this,
            type: SET,
            index: index,
            item: val
          });
        }
      });
    }
  }

  static EVENT_SORT = SORT;
  static EVENT_ADD = ADD;
  static EVENT_REMOVE = REMOVE;
  static EVENT_SET = SET;

  static setup(obj, key, val) {
    if (!ObservableArray.isObservableArray(val)) {
      val = new ObservableArray(val);
    }

    val._handler = (event) => obj.__changing(key, event);

    return val;
  }

  /**
   * Iterator implementation.
   * @returns {*}
   */
  [Symbol.iterator]() {
    return new ObservableArrayIterator(this);
  }


  raiseEvent(event) {
    if (this._handler) this._handler(event);
  }

  get length() {
    return this._array.length;
  }

  push(item) {
    this._array.push(item);

    this.defineIndexProperty(this.length - 1);

    this.raiseEvent({
      array: this,
      type: ADD,
      index: this.length - 1,
      item: item
    })
  }

  pop() {
    let item = this._array.pop();

    delete this[this.length - 1];

    this.raiseEvent({
      array: this,
      type: REMOVE,
      index: this.length - 1,
      item: item
    });

    return item;
  }

  unshift() {
    let count = this._array.unshift.apply(this._array, arguments);

    for (let i = 0; i < count; i++) {
      this.defineIndexProperty(this.length + i);

      this.raiseEvent({
        array: this,
        type: ADD,
        index: i,
        item: arguments[i + 1]
      })
    }

    return count;
  }

  shift() {
    let item = this._array.shift();

    delete this[this.length - 1];

    this.raiseEvent({
      array: this,
      type: REMOVE,
      index: 0,
      item: item
    });

    return item;
  }

  splice() {
    // arguments[0] is the start index
    // arguments[1] is the deleteCount
    // arguments[n] for n>1 are items to splice
    let startIndex = arguments[0];
    let deleteCount = arguments[1];
    let removed = this._array.splice.apply(this._array, arguments);

    let lengthDelta = -removed.length;

    for (let i = 0; i < removed.length; i++) {
      this.raiseEvent({
        array: this,
        type: REMOVE,
        index: startIndex + i,
        item: removed[i]
      });
    }

    // splice uses flat parameters to add, not an array
    // need to grab all arguments for n>1
    let toAdd = Array.prototype.slice.call(arguments, 2); // produces an array

    if (toAdd) {

      for (let i = 0; i < toAdd.length; i++) {
        this.raiseEvent({
          array: this,
          type: ADD,
          index: startIndex + i,
          item: toAdd[i]
        });
      }

      lengthDelta += toAdd.length;
    }

    if (lengthDelta > 0) {
      for (let i = 0; i < lengthDelta; i++) {
        this.defineIndexProperty(this.length - 1 - i);
      }
    } else if (lengthDelta < 0) {
      for (let i = 0; i < -lengthDelta; i++) {
        delete this[this.length + i];
      }
    }

    return removed;
  }

  sort(fn) {
    let oldArray = this._array.slice();
    this._array.sort(fn);

    // only raise an event if something's happened
    if (oldArray.some( (val, index) => val !== this._array[index])) {
      this.raiseEvent({
        array: this,
        type: SORT
      });
    }

    return this._array;
  }

  reverse() {
    this._array.reverse();

    this.raiseEvent({
      array: this,
      type: SORT
    });

    return this._array;
  }


  static isObservableArray(obj) {
    return !obj ? false : (this === obj.constructor);
  }

  static isArray(obj) {
    return Array.isArray(obj);
  }

  isArray(obj) {
    return Array.isArray(obj);
  }

  join() {
    return this._array.join.apply(this._array, arguments);
  }

  forEach(fn) {
    return this._array.forEach(fn);
  }

  slice() {
    return this._array.slice.apply(this._array, arguments);
  }

  concat() {
    return this._array.concat.apply(this._array, arguments);
  }

  includes(fn) {
    return this._array.includes(fn);
  }

  reduce() {
    return this._array.reduce.apply(this._array, arguments);
  }

  map(fn) {
    return this._array.map(fn);
  }

  filter(fn) {
    return this._array.filter(fn);
  }

  find(fn) {
    return this._array.find(fn);
  }

  some(fn) {
    return this._array.some(fn);
  }

  indexOf(val) {
    return this._array.indexOf(val);
  }

  findIndex(fn) {
    return this._array.findIndex(fn);
  }

  toArray() {
    return this._array;
  }
}