/**
 * Returns an immutable object based on the data contained in a model.
 *
 * This uses structural sharing to make this efficient as possible.
 *
 * @returns {{}|*}
 */
export default function immutableBinding () {
  if (!this.__rebuildImmutable) {
    return this.__immutable;
  }g

  let bind = {
    __start: Date.now(),
    _type: this.constructor.model
  };

  for (let i = 0; i < this.constructor.def.keys.length; i++) {
    let prop = this.constructor.def.keys[i];

    //This property is virtual, don't persist it.
    if (prop.virtual) {
      continue;
    }

    //Nothings changed!  Re-use the last value.
    if (!this.__propChanged[prop]) {
      bind[prop] = this.__immutable ? this.__immutable[prop] : this.__data[prop];
      continue;
    }

    let def = this.constructor.def[prop];
    let val = this.__data[prop];

    //For primitives, there is no structural sharing anyways so use what is in data.
    if (!def.isArray && !def.type.isModel) {
      bind[prop] = val;
    }

    //If the data is undefined or null anyways, it doesn't really matter what else is true.
    else if (this.__data[prop] === undefined || this.__data[prop] === null) {
      bind[prop] = this.__data[prop];
    }

    //This has changed, and its an array, and its an array of models.  Create a new array instance
    //by using the bind getter on each model.  The model instance will figure out if its changed or not
    //and recursively call itself.
    else if (def.isArray && def.type.isModel) {
      bind[prop] = val && val._array ? val._array.map.call(val, (item) => item ? item.immutable : null) : null;
    }

    //An array of other things have changed.  Create a new array instance, but use the data in data.
    else if (def.isArray) {
      bind[prop] = [].concat(val && val._array ? val._array : val);
    }

    //It's a model.  Let it figure out whats changed by a recursive call.
    else if (!def.isArray && def.type.isModel) {
      bind[prop] = val.immutable;
    }

    //Can we even get here?
    else {
      bind[prop] = val;
      //TODO: log  a warning here since this seems to be an impossible code path.
    }

    this.__propChanged[prop] = false;
  }

  //Clear the changed flag
  this.__rebuildImmutable = false;

  //Store the last values for this instance.
  if (this.constructor.historyEnabled && this.__immutable && (Date.now() - this.__immutable.__start) > this.constructor.historyInterval) {
    //TODO: does it make sense to use an interval here?  The interval should be used on the notify on the model itself.
    //TODO: I actually think this entire history functionality should be moved out of this immutable binding piece anyways.
    this.__immutable.__end = Date.now();
    this.__history.push(this.__immutable);
  }

  this.__lastImmutable = this.__immutable;
  this.__immutable = bind;

  return this.__immutable;
}