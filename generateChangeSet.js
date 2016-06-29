/**
 * Recursively generates a changeSet based on an old value of an instance compared to a new one.
 *
 * The objRefsSame flag is used as an optimization when we know that the two objects being compared have been
 * generated on the same stack.  IE. we are not comparing a value from an API to one that was generated locally.
 *
 * @param defs the object property definition from the model that describes these two immutable objects
 * @param bind1 the immutable object that we are starting with
 * @param bind2 the immutable object that we are changing to
 * @param objRefsSame should object references be the same for objects and arrays?
 * @param change the current changeSet
 * @param path the current path to sub-objects properties.
 * @returns {*}
 */
export default function generateChangeSet(defs, bind1, bind2, objRefsSame = false, change = {}, path = '') {

  for (let i = 0; i < defs.keys.length; i++) {
    let key = defs.keys[i];
    let def = defs[key];

    /**
     * TODO:  Make a developer note that setting a value to undefined will not unset it from the database.
     *        only setting a value to null will unset it.
     *
     * This is because:
     *
     * 1) undefined values are not included in JSON (ie all the calls we make to the server).
     * 2) MongoDB does not store undefined values for the above reason
     *
     * Devs should use undefined to represent that we are unaware of what the data maybe (it is literally undefined).
     * null means we do know what the data is, and it is empty.
     */

    /**
     * Virtual properties are not persisted in the database.
     */
    if (def.virtual) {
      continue;
    }

    else if (bind2[key] === undefined) {
      //no-op
    }

    //TODO: Neither this case nor the case of line 46 would capture if we're going from undefined -> null, when we don't know something to when we know that it isn't there and can be persisted appropriately.
    //If the data has changed to null, it doesn't really matter what else is true.
    else if (bind2[key] === null && (bind1[key] !== undefined || bind1[key] !== null)) {
      if (!change.$unset) change.$unset = {};
      change.$unset[path + key] = true;
    }

    //Same goes for if value was null, but now is anything.
    else if (bind1[key] === undefined || bind1[key] === null && (bind2[key] !== undefined || bind2[key] !== null)) {
      if (!change.$set) change.$set = {};

      change.$set[path + key] = bind2[key];
    }

    //For primitives, there is no complex comparison needed.
    else if (!def.array && !def.type.isModel) {
      //Values aren't the same?
      if (bind1[key] !== bind2[key]) {
        //Make sure the $set object exists.
        if (!change.$set) change.$set = {};

        change.$set[path + key] = bind2[key];
      }
    }

    //An array of Models may have changed.
    else if (def.array && def.type.isModel) {
      //First check the object references to see if the array wrapper has changed.  If the references are the same,
      //this array has not changed.

      if (!(objRefsSame && bind1[key] === bind2[key])) {
        //How is this model uniquely defined?  By id or micro-guid.
        let idKey = defs._id ? '_id' : '_mg';
        let fullSetRequired = false;

        if (bind1[key].length > bind2[key].length) {
          //If bind1 is a larger array than bind2 then
          // - iff all the ids in bind2 exist in bind1 in order, only removes have been made.
          // - else full set
          let potentialPull = [];

          let j = 0, k = 0, totalFound = 0;

          while (k < bind2[key].length) {
            if (bind2[key][k][idKey] !== bind1[key][j][idKey]) {
              j++;
              potentialPull.push(bind1[key][j][idKey]);
            } else {
              totalFound++;
              j++;
              k++;
            }
          }

          if (totalFound !== bind2[key].length) {
            fullSetRequired = true;
          } else {
            //Create a change set that pulls by unique key on this model, ie.
            //change.$pull = {
            //  'logins._id': {$in: [1, 2]}
            //};
            if (!change.$pull) change.$pull = {};
            change.$pull[`${path}${key}.${idKey}`] = {$in: potentialPull}
          }
        } else if (bind1[key].length < bind2[key].length) {
          //else if bind1 is a smaller array then bind2
          // - if all ids in bind1 exist in bind2 in order, with no gaps, only simple adds have been made
          // - else full set

          let j = 0, k = 0, gaps = 0, totalFound = 0, prevWasGap = false;

          let potentialAdd = {
            $each: [],
            $position: undefined
          };

          while (j < bind1[key].length) {
            if (bind1[key][j][idKey] !== bind2[key][k][idKey]) {
              if (!prevWasGap) gaps++;
              prevWasGap = true;
              k++;
              potentialAdd.$each.push(bind2[key][k]);
              if (potentialAdd.$position === undefined) potentialAdd.$position = j;
            } else {
              prevWasGap = false;
              totalFound++;
              j++;
              k++;
            }
          }

          if (gaps > 1 || totalFound !== bind1[key].length) {
            fullSetRequired = true;
          } else {
            //Create a change set that pushes all values, ie.
            //change.$push = {
            //  logins: {
            //    $each: [obj1, obj2],
            //    $position: 0
            //  }
            //};
            if (!change.$push) change.$push = {};
            change.$push[`${path}${key}`] = potentialAdd;

          }
        } else {
          // - if all ids in bind1 exist in bind2, in order, sets by index have been made.
          // - else full set.
          let potentialSets = {};

          for (let j = 0; j < bind1[key].length; j++) {
            //First easiest check is too see if the object references are the same
            if (!(objRefsSame && bind1[key][j] === bind2[key][j])) {
              //Check to see if the keys are the same.
              if (bind1[key][j][idKey] !== bind2[key][j][idKey]) {
                fullSetRequired = true;
                break;
              } else {
                generateChangeSet(def.type.def, bind1[key][j], bind2[key][j], objRefsSame, potentialSets, `${path}${key}.${j}.`);
              }
            }
          }

          //If we have made it this far, then we should merge these potential sets into the changeSet.
          Object.assign(change, potentialSets);
        }

        //After all that work, a full set was required anyways.
        if (fullSetRequired) {
          //Lazily create the $set object.
          if (!change.$set) change.$set = {};

          change.$set[path + key] = bind2[key];
        }
      }
    }

    //An array of primitives may have changed.
    else if (def.array) {
      //TODO: this could also be optimized using the logic from above.  But is it worth the optimization?
      if (!(objRefsSame && bind1[key] === bind2[key])) {
        if ((bind1[key].length !== bind2[key].length) || bind1[key].some((item, index) => bind2[key][index] !== item)) {
          //Lazily create the $set object.
          if (!change.$set) change.$set = {};

          change.$set[path + key] = bind2[key];
        }
      }
    }

    //It's a model.
    else if (!def.array && def.type.isModel) {
      if (!(objRefsSame && bind1[key] === bind2[key])) {
        generateChangeSet(def.type.def, bind1[key], bind2[key], objRefsSame, change, `${path}${key}.`);
      }
    }

    else {
      //Can we even get here?
      //TODO: check to see if this is what happens when a type is a function, at very least a warning should be thrown.
    }
  }

  return change;
}