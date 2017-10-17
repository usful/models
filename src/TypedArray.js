import FBEmitter from 'fbemitter';
const { EventEmitter } = FBEmitter;

const ARRAY_FUNCTIONS = [
  'sort',
  'filter',
  'join',
  'reverse',
  'slice',
  'concat'
];

const FUNCTIONS = [
  'forEach',
  'includes',
  'reduce',
  'map',
  'find',
  'findIndex',
  'some',
  'indexOf'
];

class TypedArrayIterator {
  static isTypedArray(obj) {
    return !obj ? false : this === obj.constructor;
  }

  static isArray(obj) {
    return Array.isArray(obj);
  }

  constructor(array) {
    this.i = 0;
    this.array = array;
  }

  next() {
    if (this.i >= this.array.length) {
      this.i = 0;
      return { done: true };
    }

    return { done: false, value: this.array[this.i++] };
  }
}

export default class TypedArray {
  constructor(items, type) {
    this.__array = Array.isArray(items) ? [].concat(items) : [items];
    this.__parent = null;
    this.__parentKey = null;
    this.type = type;

    for (let i = 0; i < this.__array.length; i++) {
      this.defineIndexProperty(i);
    }

    //Cast any children.
    if (this.isModel) {

      this.__array = this.__array.map(
        item =>
          !item || item.constructor === this.type ? item : new this.type(item)
      );
    }

    //Set any initial children.
    this.setParents();

    this.__json = this._toJSON();
  }

  defineIndexProperty(index) {
    if (!(index in this)) {
      Object.defineProperty(this, index, {
        configurable: true,
        enumerable: true,
        get: function() {
          return this.__array[index];
        },
        set: function(val) {
          if (this.type.isModel) {
            //Clear out references for garbage collection
            if (this.__array[index]) {
              this.__array[index].__parent = null;
              this.__array[index].__parentKey = null;
            }

            if (val) {
              val.__parent = this;
              val.__parentKey = index;
            }
          }

          this.__array[index] = val;
          this.__changed(index);
        }
      });
    }
  }

  get isModel() {
    return this.type && this.type.isModel;
  }

  setParents() {
    if (this.isModel) {
      for (let i = 0; i < this.__array.length; i++) {
        if (this.__array[i]) {
          this.__array[i].__parent = this;
          this.__array[i].__parentKey = i;
        }
      }
    }
  }

  clearParents() {
    if (this.isModel) {
      for (let i = 0; i < this.__array.length; i++) {
        if (this.__array[i]) {
          this.__array[i].__parent = null;
          this.__array[i].__parentKey = null;
        }
      }
    }
  }

  __changed(index) {
    this.__json = this._toJSON();

    this.emit('change', index);

    if (this.__parent) {
      this.__parent.__changed(this.__parentKey);
    }
  }

  /**
   * Iterator implementation.
   * @returns {*}
   */
  [Symbol.iterator]() {
    return new TypedArrayIterator(this);
  }

  get length() {
    return this.__array.length;
  }

  push(item) {
    this.__array.push(item);
    this.defineIndexProperty(this.length - 1);
    this.setParents();
    this.__changed(this.length - 1);
  }

  pop() {
    let item = this.__array.pop();

    if (this.isModel && item) {
      item.__parent = null;
      item.__parentKey = null;
    }

    this.setParents();
    this.__changed(this.length);
    return item;
  }

  unshift() {
    let count = this.__array.unshift.apply(this.__array, arguments);

    for (let i = 0; i < count; i++) {
      this.defineIndexProperty(this.length + i);
    }

    this.setParents();
    this.__changed(0);

    return count;
  }

  shift() {
    let item = this.__array.shift();

    if (this.isModel && item) {
      item.__parent = null;
      item.__parentKey = null;
    }

    this.setParents();
    this.__changed(0);
    return item;
  }

  splice() {
    // arguments[0] is the start index
    // arguments[1] is the deleteCount
    // arguments[n] for n>1 are items to splice
    let removed = this.__array.splice.apply(this.__array, arguments);

    removed.forEach(item => {
      if (this.isModel && item) {
        item.__parent = null;
        this.__parentKey = null;
      }
    });

    let lengthDelta = -removed.length;
    // splice uses flat parameters to add, not an array
    // need to grab all arguments for n>1
    let toAdd = Array.prototype.slice.call(arguments, 2); // produces an array

    if (toAdd) {
      lengthDelta += toAdd.length;
    }

    if (lengthDelta > 0) {
      for (let i = 0; i < lengthDelta; i++) {
        this.defineIndexProperty(this.length - 1 - i);
      }
    }

    this.setParents();

    this.__changed(this.length);
    return removed;
  }

  get isTypedArray() {
    return true;
  }

  valueOf() {
    return this.__json;
  }

  _toJSON() {
    if (this.isModel) {
      this.__json = this.__array.map(item => (item ? item.toJSON() : item));
      return this.__json;
    }

    this.__json = [].concat(this.__array);
    return this.__json;
  }

  toJSON() {
    return this.__json;
  }

  /**
   * Returns an new plain Array with the contents that were in this TypedArray instance.
   *
   * @returns {array}
   */
  toArray() {
    return [].concat(this.__array);
  }

  _initEmitter() {
    if (!this._emitter) {
      this._emitter = new EventEmitter();
    }
  }

  listeners() {
    this._initEmitter();
    return this._emitter.listeners.apply(this._emitter, arguments);
  }

  emit() {
    if (!this._emitter) {
      return;
    }

    return this._emitter.emit.apply(this._emitter, arguments);
  }

  once() {
    this._initEmitter();
    return this._emitter.once.apply(this._emitter, arguments);
  }

  removeAllListeners() {
    if (!this._emitter) {
      return;
    }

    return this._emitter.removeAllListeners.apply(this._emitter, arguments);
  }

  addListener() {
    this._initEmitter();
    return this._emitter.addListener.apply(this._emitter, arguments);
  }
}

ARRAY_FUNCTIONS.forEach(
  f =>
    (TypedArray.prototype[f] = function() {
      const newArr = new TypedArray(
        this.__array[f].apply(this.__array, arguments),
        this.type
      );

      newArr.__parent = this.__parent;
      newArr.__parentKey = this.__parentKey;

      return newArr;
    })
);

FUNCTIONS.forEach(
  f =>
    (TypedArray.prototype[f] = function() {
      return this.__array[f].apply(this.__array, arguments);
    })
);
