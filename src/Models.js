import TypedArray from './TypedArray';
import Middleware from './middleware';

const primitives = [String, Number, Boolean, Array, Date];

function Models({ middleware = [], changeThrottle = 1 }) {
  const definitions = {};

  function createModel(properties) {
    function model(data) {
      if (this.constructor !== model) {
        throw new Error('Must be invoked with new.');
      }

      this.__data = {};
      this.__parent = null;
      this.__parentKey = null;

      //Call any middleware initializers, if they exist.
      this.constructor.middleware.forEach(
        fn => (fn.initialize ? fn.initialize.call(this, data) : null)
      );

      if (data) {
        Object.keys(data).forEach(key => {
          if (data.hasOwnProperty(key)) {
            this[key] = data[key];
          }
        });

        //Flush the data.
        if (this.__flush) {
          this.__flush();
        }
      }

      return this;
    }

    model.changeThrottle = changeThrottle;

    //Store the model definition for later.
    model.def = {
      props: []
    };

    //Process all the properties sent in.
    for (let key of Object.keys(properties)) {
      if (!properties.hasOwnProperty(key)) {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(properties, key);

      //Property can be a getter/setter, a function, a simple definition,
      //a Model, a user defined Type, or a complex definition (wrapped in an object)

      //This is a getter or setter passed in.
      if (descriptor.get || descriptor.set) {
        Object.defineProperty(model.prototype, key, {
          get: descriptor.get,
          set: descriptor.set
        });
        continue;
      }

      let prop = {
        key: key
      };

      //Unpack array types. ie. names: [String]
      if (Array.isArray(descriptor.value)) {
        prop.type = descriptor.value[0];
        prop.isArray = true;
      }

      const property = properties[key];

      if (typeof descriptor.value === 'object' && descriptor.value.type) {
        //This is a complex type definition being passed in.
        prop = {
          key: key,
          ...property
        };
      } else if (typeof descriptor.value === 'string') {
        //This is a lazy reference to another model being passed in.  Will be dealt with later.
        prop.type = descriptor.value;
      } else if (primitives.includes(descriptor.value)) {
        //This is a primitive type, defined simply.
        prop.type = descriptor.value;
      } else if (
        typeof descriptor.value === 'function' &&
        descriptor.value.isModel
      ) {
        //This is a model definition that was passed in.
        prop.type = descriptor.value;
      } else if (typeof descriptor.value === 'function') {
        //Some other kind of function passed in.
        model.prototype[key] = descriptor.value;
        continue;
      }

      //Setup the getters and setter for this guy.
      Object.defineProperty(model.prototype, prop.key, {
        get: function() {
          return this.__data[prop.key];
        },
        set: function(val) {
          let newVal = val;
          if (prop.type === Date && val) {
            //TODO: dates could have some more weirdness.
            newVal = new Date(val);
          } else if (prop.type.isModel || prop.isArray) {

            // If this type is a model (deep object) or an array, we need to be able to propagate changes later.
            //We also need to clear parent values from the old values if they exist for garbage collection.
            if (this.__data[prop.key]) {
              //TODO: what about arrays with parentKeys? Do we need to clear all of them, then reset again?
              this.__data[prop.key].__parent = null;
              this.__data[prop.key].__parentKey = null;
            }

            if (val !== null && val !== undefined) {
              if (prop.isArray && !val.isTypedArray) {
                //This prop type is an array, and you are not setting a TypedArray, we will cast it for you.
                newVal = new TypedArray(val, prop.type);
              } else if (prop.isArray && val.isTypedArray) {
                //Clone it, because this is coming from another object?
                newVal = new TypedArray(val.toJSON(), prop.type);
              } else if (prop.type.isModel && val.constructor !== prop.type) {
                //This value is a model, but it has not been created as a model yet.
                newVal = new prop.type(val);
              } else if (
                prop.type.isModel &&
                val.constructor === prop.type.model
              ) {
                //This value is a model, and it is coming from another object? Clone it.
                newVal = new prop.type(val.toJSON());
              }

              newVal.__parent = this;
              newVal.__parentKey = prop.key;
            }
          } else {
            newVal = val;
          }

          this.__data[prop.key] = newVal;

          if (prop.listen !== false) {
            this.__changed(prop.key);
          }
        },
        configurable: false,
        enumerable: true
      });

      model.def.props.push(prop);
    }

    model.prototype.__changed = function(key) {
      if (this.__parent) {
        this.__parent.__changed(this.__parentKey);
      }
    };

    model.isModel = true;

    return model;
  }

  return new class Models {
    create(name, properties) {
      const model = createModel(properties);

      //Call all the middle wares for this model in order.
      middleware.forEach(fn => fn(model));

      model.model = name;
      model.middleware = middleware;
      definitions[name] = model;

      //TODO: probably a better way to do this than iterate over all after each model is added.
      //Attached references by name (string passed in as prop type).
      for (let modelName in definitions) {
        const modelDefinition = definitions[modelName];

        modelDefinition.def.props
          .filter(prop => typeof prop.type === 'string')
          .forEach(prop => {
            if (definitions[prop.type]) {
              prop.type = definitions[prop.type];
            }
          });
      }

      return model;
    }

    addMiddleware(mw) {
      for (let definition in definitions) {
        mw(definitions[definition]);
      }

      middleware.push(mw);
    }

    get definitions() {
      return definitions;
    }

    get middleware() {
      return middleware;
    }

    get Middleware() {
      return Middleware;
    }

    get changeThrottle() {
      return changeThrottle;
    }
  }();
}

Models.middleware = Middleware;
Models.TypedArray = TypedArray;

export default Models;

/**
 const Template = new Models.Document('Template', {name: String});
 const template = new Template({name: 'Test'});
 
 template.validate();
 template.addListener('changed', (data) => console.log(data));
 */
