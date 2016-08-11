/**
 * Composes functions, getters, setters, properties to an object and binds them properly.
 *
 * @param obj the object to compose onto
 * @param compositions an object containing all the functions, getters, setters, propertie to compose
 * @returns {*}
 */
export default function compose(obj, compositions) {

  if (!compositions) {
    compositions = obj;
    obj = {};
  }

  //Easier to assume an array of composition objects have been passed in
  if (!Array.isArray(compositions)) {
    compositions = [compositions];
  }

  for (let composition of compositions) {

    for (let key in composition) {
      //Check to see if this property was inherited, if so it should not be composed.
      //TODO: should this throw a warning? Devs may expect that it would compose inherited methods.
      if (composition.hasOwnProperty(key)) {
        let desc = Object.getOwnPropertyDescriptor(composition, key);

        //Check to see if the property descriptor actually defines a getter || setter.  These are composed slightly
        //differently.
        if (desc.get || desc.set) {
          Object.defineProperty(obj, key, {
            get: desc.get,
            set: desc.set,
            enumerable: desc.enumerable,
            writeable: desc.writeable,
            configurable: desc.configurable
          });
        } else {
          /**
           * TODO: this assigns by reference, not by copy.  This probably shouldn't be an issue, but anyone using
           * compose should be aware that it works this way.
           *
           * IE. you shouldn't be composing objects that you are using later.
           */
          obj[key] = composition[key];

          //If this is a function, bind that function to the object passed in.
          if (obj[key].construtor === Function) {
            obj[key].bind(obj);
          }
        }
      }
    }
  }

  return obj;
}