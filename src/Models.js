import FBEmitter from 'fbemitter';
const { EventEmitter } = FBEmitter;

import TypedArray from './TypedArray';
import Validation from './Validation';
import ValidationError from './ValidationError';
import compose from './compose';

let onReady = () => null;
const THROTTLE = 1;

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
    }

    return this;
  }

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
        // If this type is a model (deep object) or an array, we need to be able to propagate changes later.
        if (prop.type.isModel || prop.isArray) {
          //We also need to clear parent values from the old values if they exist for garbage collection.
          if (this.__data[prop.key]) {
            this.__data[prop.key].__parent = null;
            this.__data[prop.key].__parentKey = null;
          }

          if (val !== null && val !== undefined) {
            if (prop.isArray && !val.isTypedArray) {
              //This prop type is an array, and you are not setting a TypedArray, we will cast it for you.
              val = new TypedArray(val, prop.type);
            } else if (prop.type.isModel && val.constructor !== prop.type) {
              //This value is a model, but it has not been created as a model yet.
              val = new prop.type(val);
            }

            val.__parent = this;
            val.__parentKey = prop.key;
          }
        }

        this.__data[prop.key] = val;
        this.__changed(prop.key);
      },
      configurable: false,
      enumerable: true
    });

    //Lazy load definitions to allow cyclic references
    if (typeof prop.type === 'string') {
      setTimeout(() => {
        prop.type = Document[prop.type] || Structure[prop.type];
        onReady();
      }, 1);
    }

    model.def.props.push(prop);
  }

  model.prototype.validate = function() {
    const result = {};
    const props = this.constructor.def.props.filter(
      prop => prop.validators && prop.validators.length > 0
    );
    let valid = true;

    props.forEach(prop => {
      //Required is a special validator, so we will check to see if its in the list.
      const isRequired = prop.validators.some(
        validator => validator === Validation.required
      );

      const hasValue = Validation.required.validate.call(
        this,
        this.__data[prop.key]
      );

      if (isRequired && !hasValue) {
        valid = false;
        result[prop.key] = false;
        //If required validation failed, no need to continue.
        return;
      } else if (!isRequired && !hasValue) {
        //If something is not required, and it has no value, it is technically valid.
        result[prop.key] = true;
        return;
      }

      prop.validators.forEach(validator => {
        if (validator === Validation.required) {
          return;
        }

        result[prop.key] = validator.call(this, this.__data[prop.key]);

        if (!result[prop.key]) {
          valid = false;
        }
      });
    });

    if (!valid) {
      throw new ValidationError(result);
    }

    return true;
  };

  model.prototype.valueOf = function() {
    return this.__json;
  };

  model.prototype.toJSON = function() {
    return this.__json;
  };

  model.prototype.__changed = function(key) {
    if (!this.__dirty) {
      this.__dirty = setTimeout(() => {
        const data = {
          ...this.__data
        };
    
        this.constructor.def.props
          .filter(prop => prop.type.isModel || prop.isArray)
          .forEach(
            prop =>
              (data[prop.key] = data[prop.key]
                ? data[prop.key].toJSON()
                : data[prop.key])
          );
    
        this.__json = data;
        this.__dirty = null;
        this.emit('change', data);
  
      }, THROTTLE);
    }
  
    this.emit(`${key}Changed`, );
  
    if (this.__parent) {
      this.__parent.__changed(this.__parentKey);
    }
  };

  model.prototype._initEmitter = function() {
    if (!this._emitter) {
      this._emitter = new EventEmitter();
    }
  };

  model.prototype.listeners = function() {
    this._initEmitter();
    return this._emitter.listeners.apply(this._emitter, arguments);
  };

  model.prototype.emit = function() {
    if (!this._emitter) {
      return;
    }

    return this._emitter.emit.apply(this._emitter, arguments);
  };

  model.prototype.once = function() {
    this._initEmitter();
    return this._emitter.once.apply(this._emitter, arguments);
  };

  model.prototype.removeAllListeners = function() {
    if (!this._emitter) {
      return;
    }

    return this._emitter.removeAllListeners.apply(this._emitter, arguments);
  };

  model.prototype.addListener = function() {
    this._initEmitter();
    return this._emitter.addListener.apply(this._emitter, arguments);
  };

  model.isModel = true;

  return model;
}

function Document(name, properties) {
  if (this.constructor !== Document) {
    throw new Error('Must be invoked with new.');
  }

  const document = createModel(properties);
  document.isDocument = true;
  document.model = name;

  Document[name] = document;
  return document;
}

function Structure(name, properties) {
  if (this.constructor !== Structure) {
    throw new Error('Must be invoked with new.');
  }

  const structure = createModel(properties);
  structure.isStructure = true;
  structure.model = name;

  Structure[name] = structure;
  return structure;
}

export default {
  Document: Document,
  Structure: Structure,
  Validators: Validation,
  onReady: cb => (onReady = cb),
  utils: {
    compose: compose
  }
};
