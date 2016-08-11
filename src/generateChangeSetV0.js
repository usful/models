/**
 * Generates a changeSet based on an old value of an instance compared to a new one.
 *
 * This should only be used until the production API is upgraded to v3.0.0 +.
 *
 * @param defs the object property definition from the model that describes these two immutable objects
 * @param bind1 the immutable object that we are starting with
 * @param bind2 the immutable object that we are changing to
 * @returns {*}
 * @deprecated since v3.0.0, used for transition period from v2.9.x
 */
export default function generateChangeSetV0(defs, bind1, bind2) {

  let change = {};

  for (let i = 0; i < defs.keys.length; i++) {
    let key = defs.keys[i];

    /**
     * Virtual properties are not persisted in the database.
     */
    if (defs[key].virtual) {
      continue;
    }

    else if (bind2[key] === undefined) {
      //no-op
    }

    //If the data has changed to null, it doesn't really matter what else is true.
    else if (bind2[key] === null && (bind1[key] !== undefined || bind1[key] !== null)) {
      change[key] = {
        cmd: 'unset'
      };
    }

    //Same goes for if value was null, but now is anything.
    else if (bind1[key] === undefined || bind1[key] === null && (bind2[key] !== undefined || bind2[key] !== null)) {
      change[key] = {
        cmd: 'set',
        val: bind2[key]
      };
    }

    else if (bind1[key] !== bind2[key]) {
      change[key] = {
        cmd: 'set',
        val: bind2[key]
      };
    }
  }

  return change;
}