import FBEmitter from 'fbemitter';
const { EventEmitter } = FBEmitter;

const ARRAY_FUNCTIONS = ['sort', 'reverse'];

const FUNCTIONS = [
  'join',
  'slice',
  'concat',
  'filter',
  'forEach',
  'includes',
  'reduce',
  'map',
  'find',
  'findIndex',
  'some',
  'indexOf'
];

const cast = (val, type) => {
  let newVal = val;

  if (type === Date && val && val.constructor !== Date) {
    //TODO: dates could have some more weirdness.
    newVal = new Date(val);
  } else if (type.isModel) {
    if (val !== null && val !== undefined) {
      if (val.constructor !== type) {
        //This value is a model, but it has not been created as a model yet.
        newVal = new type(val);
      } else if (type.isModel && val.constructor === type.model) {
        //This value is a model, and it is coming from another object? Clone it.
        newVal = new type(val.toJSON());
      }
    }
  }

  return newVal;
};

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
  static changeThrottle = 0;

  __cast(val) {
    if (!this.isModel) {
      return val;
    } else {
      return cast(val, this.type);
    }
  }

  constructor(items, type) {
    this.__array = Array.isArray(items) ? [].concat(items) : [items];
    this.__parent = null;
    this.__parentKey = null;
    this.__keysChanged = [];
    this.type = type;

    for (let i = 0; i < this.__array.length; i++) {
      this.defineIndexProperty(i);
    }

    //Cast any children.
    if (this.isModel) {
      this.__array = this.__array.map(item => this.__cast(item));
    }

    //Set any initial children.
    this.setParents();

    //Flush the data.
    if (this.__flush) {
      this.__flush();
    }
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
          const newVal = this.__cast(val);

          if (this.type.isModel) {
            //Clear out references for garbage collection
            if (this.__array[index]) {
              this.__array[index].__parent = null;
              this.__array[index].__parentKey = null;
            }

            if (newVal) {
              newVal.__parent = this;
              newVal.__parentKey = index;
            }
          }

          this.__array[index] = newVal;
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

  __flush() {
    if (this.isModel) {
      this.__json = this.__array.map(item => {
        if (item) {
          item.__flush();
          return item.toJSON();
        } else {
          return item;
        }
      });
    } else {
      this.__json = [].concat(this.__array);
    }

    this.__dirty = false;

    this.emit('change', this.__json);
    this.__keysChanged.forEach(key => this.emit(`${key}Changed`));
    this.__keysChanged = [];
  }

  __changed(key) {
    if (!this.__dirty) {
      this.__dirty = setImmediate(() => this.__flush());
    }

    if (!this.__keysChanged) {
      this.__keysChanged = [key];
    } else {
      if (!this.__keysChanged.includes(key)) this.__keysChanged.push(key);
    }

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
    const newItem = this.__cast(item);
    this.__array.push(newItem);
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
    //TODO: this does not yet convert to type.
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
