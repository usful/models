import TypedArray from './TypedArray';
import Middleware from './middleware';

function Models({ middleware = [], changeThrottle = 1 }) {
  const definitions = {};

  function createModel(properties) {
    function model(data) {
      if (this.constructor !== model) {
        throw new Error('Must be invoked with new.');
      }

      this.__data = {};
      this.__json = {};
      this.__dirty = false;
      this.__parent = null;
      this.__parentKey = null;

      if (data) {
        Object.keys(data).forEach(key => {
          if (data.hasOwnProperty(key)) {
            this[key] = data[key];
          }
        });

        //Flush the data.
        if (this.__flush()) {
          this.__flush();
        }
      }

      return this;
    }

    model.changeThrottle = changeThrottle;

    //Store the model definition for later.
    model.def = {
      ...properties,
      props: []
    };

    //Process all the properties sent in.
    for (let key in properties) {
      const prop = {
        key: key
      };

      //Props can be passed in as a simple definition or a complex one.
      //Simple
      //  name: String
      //
      //Complex
      //  name: {
      //    type: String,
      //    validators: ..
      //  }

      if (properties[key].constructor === Object && properties[key].type) {
        prop.type = properties[key].type;
        prop.validators = properties[key].validators;
        prop.default = properties[key].default;
        prop.virtual = !!properties[key].virtual;
        prop.listen = !!properties[key].listen;
      } else {
        prop.type = properties[key];
      }

      //Unpack array types. ie. names: [String]
      if (Array.isArray(prop.type)) {
        prop.type = prop.type[0];
        prop.isArray = true;
      }

      //Setup the getters and setter for this guy.
      Object.defineProperty(model.prototype, prop.key, {
        get: function() {
          return this.__data[prop.key];
        },
        set: function(val) {
          if (prop.type === Date && val) {
            //TODO: dates could have some more weirdness.
            val = new Date(val);
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
                val = new TypedArray(val, prop.type);
              } else if (prop.isArray && val.isTypedArray) {
                //Clone it, because this is coming from another object?
                val = new TypedArray(val.toJSON(), prop.type);
              } else if (prop.type.isModel && val.constructor !== prop.type) {
                //This value is a model, but it has not been created as a model yet.
                val = new prop.type(val);
              } else if (prop.type.isModel && val.constructor === prop.type) {
                //This value is a model, and it is coming from another object? Clone it.
                val = new prop.type(val.toJSON());
              }

              val.__parent = this;
              val.__parentKey = prop.key;
            }
          }

          this.__data[prop.key] = val;

          if (!!prop.listen) {
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
              console.log('Fixing', modelName, prop.key, prop.type);
              prop.type = definitions[prop.type];
            }
          });
      }

      return model;
    }

    addMiddleware(middleware) {
      for (let definition in definitions) {
        middleware(definitions[definition]);
      }
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
