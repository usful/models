
const FUNCTIONS = ['sort', 'reverse', 'join', 'forEach', 'slice', 'concat', 'includes', 'reduce', 'map', 'filter', 'find', 'findIndex', 'some', 'indexOf'];

class TypedArrayIterator {
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

export default class TypedArray {
  constructor(items, type) {
    this.__array = Array.isArray(items) ? [].concat(items) : [items];
    this.type = type;
    
    for (let i = 0; i < this.__array.length; i++) {
      this.defineIndexProperty(i);
    }
  }

  defineIndexProperty(index) {
    if (!(index in this)) {
      Object.defineProperty(this, index, {
        configurable: true,
        enumerable: true,
        get: function () {
          return this.__array[index];
        },
        set: function (val) {
          if (this.type.isModel) {
            if (!val && this.__array[index]) {
              this.__array[index].__parent = null;
            } else if (val) {
              val.__parent = this;
            }
          }

          this.__array[index] = val;
          this.__changed(index);
        }
      });
    }
  }
  
  get shouldSetParent() {
    return this.type && this.type.isModel;
  }
  
  clearParents() {
    for (let i=0; i<this.__array.length; i++) {
      if (this.__array[i]) {
        this.__array[i].__parent = null;
      }
    }
  }
  
  __changed(index) {
    this.__array = [].concat(this.__array);
  
    if (this.onChange) {
      this.onChange(index);
    }

    if (this.__parent) {
      this.__parent.__changed();
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
    if (this.shouldSetParent && item) {
      item.__parent = this;
    }
    
    this.__array.push(item);
    this.defineIndexProperty(this.length - 1);
    this.__changed(this.length - 1);
  }

  pop() {
    let item = this.__array.pop();
    
    if (this.shouldSetParent && item) {
      item.__parent = null;
    }
    
    this.__changed(this.length);
    return item;
  }

  unshift() {
    let count = this.__array.unshift.apply(this.__array, arguments);

    for (let i = 0; i < count; i++) {
      this.defineIndexProperty(this.length + i);
      if (this.shouldSetParent && this.__array[i]) {
        this.__array[i].__parent = this;
      }
    }
  
    this.__changed(0);
    return count;
  }

  shift() {
    let item = this.__array.shift();
  
    if (this.shouldSetParent && item) {
      item.__parent = null;
    }
  
    this.__changed(0);
    return item;
  }

  splice() {
    // arguments[0] is the start index
    // arguments[1] is the deleteCount
    // arguments[n] for n>1 are items to splice
    let removed = this.__array.splice.apply(this.__array, arguments);

    removed.forEach(item => {
      if (this.shouldSetParent && item) {
        item.__parent = null;
      }
    });
    
    let lengthDelta = -removed.length;
    // splice uses flat parameters to add, not an array
    // need to grab all arguments for n>1
    let toAdd = Array.prototype.slice.call(arguments, 2); // produces an array

    if (toAdd) {
      lengthDelta += toAdd.length;
  
      toAdd.forEach(item => {
        if (this.shouldSetParent && item) {
          item.__parent = this;
        }
      });
  
    }

    if (lengthDelta > 0) {
      for (let i = 0; i < lengthDelta; i++) {
        this.defineIndexProperty(this.length - 1 - i);
      }
    }
  
    this.__changed(this.length);
    return removed;
  }
  

  get isTypedArray() {
    return true;
  }
  
  static isTypedArray(obj) {
    return !obj ? false : (this === obj.constructor);
  }

  static isArray(obj) {
    return Array.isArray(obj);
  }

  valueOf() {
    return this.__array;
  }
  
  toJSON() {
    return this.__array;
  }
  
  /**
   * Returns an new plain Array with the contents that were in this TypedArray instance.
   *
   * @returns {array}
   */
  toArray() {
    return [].concat(this.__array);
  }
}

FUNCTIONS.forEach(f => TypedArray.prototype[f] = function() {return this.__array[f].apply(this.__array, arguments)});
