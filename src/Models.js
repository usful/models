import TypedArray from './TypedArray';
import Validation from './Validation';
import ValidationError from './ValidationError';

function createModel(properties) {
  function model(data) {
    if (this.constructor !== model) {
      throw new Error('Must be invoked with new.');
    }
    
    this.__data = data || {};
    this.__parent = null;
    
    return this;
  }
  
  //Store the model definition for later.
  model.def = {
    ... properties,
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
    }
    
    //Unpack array types. ie. names: [String]
    if (Array.isArray(prop.type)) {
      prop.type = prop.type[0];
      prop.isArray = true;
    }
    
    //Setup the getters and setter for this guy.
    Object.defineProperty(model.prototype, prop.key, {
      get: function () {
        return this.__data[prop.key];
      },
      set: function(val) {
        this.__data[prop.key] = val;
        
        // If this type is a model (deep object) or an array, we need to be able to propagate changes later.
        if (prop.type.constructor.isModel || prop.type.isArray) {
          //If we are un-setting this object, clear references.
          if (val === null || val === undefined && this.__data[prop.key]) {
            this.__data[prop.key].__parent = null;
          } else if (val) {
            if (prop.type.isArray && !val.isTypedArray()) {
              //This prop type is an array, and you are not setting a TypedArray, we will cast it for you.
              val = new TypedArray(val);
            } else if (prop.type.isModel && val.constructor !== prop.type) {
              //This value is a model, but it has not been created as a model yet.
              val = new prop.type(val);
            }
            
            val.__parent = this;
            
            this.__data[prop.key] = val;
          }
        }
        
        this.__data[prop.key] = val;
        this.__changed(prop.key);
      },
      configurable: false,
      enumerable: true,
      writable: true
    });
    
    model.def.props.push(prop);
  }
  
  model.prototype.validate = function() {
    const result = {};
    const props = this.constructor.def.props.filter(prop => prop.validators && prop.validators.length > 0);
    let valid = true;
    
    props.forEach(prop => {
      //Required is a special validator, so we will check to see if its in the list.
      const isRequired = prop.validators.some(validator => validator === Validation.required);
      const hasValue = Validation.required.validate.call(this, this.__data[prop.key]);
      
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
    return this.__data;
  };
  
  model.prototype.toJSON = function() {
    const data = {
      ... this.__data
    };
    
    this.constructor.def.props
      .filter(prop => prop.type.isModel)
      .forEach(prop => data[prop.key] = data[prop.key] ? data[prop.key].toJSON() : data[prop.key])
    ;
    
    return this.__data;
  };
  
  model.prototype.__changed = function(key) {
    this.__data = {
      ... this.__data
    };
    
    this.onChange(key);
    
    if (this.__parent) {
      this.__parent.__changed();
    }
  };
  
  model.prototype.onChange = function(key) {
    /** no-op */
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
  
  Document[name] = document();
  return document;
}

function Structure(name, properties) {
  if (this.constructor !== Structure) {
    throw new Error('Must be invoked with new.');
  }
  
  const structure = createModel(properties);
  structure.isStructure = true;
  
  Structure[name] = structure();
  return structure;
}

export default {
  Document: Document,
  Structure: Structure,
  Validators: Validation
};


/**

//Security microservice.

let security = {
  obj: '2fNwVYePN8WqqDFvVf7XMN',
  group: '2qY9COoAhfMrsH7mCyh86T', //could be a runtime group, or a userId
  roles: [
    {
      role: 'Admin',
      on: Date.now(),
      by: 'b',
      authority: 'b',
      expires: null
    }
  ]
};

security.get = async (id) => {
  const authorization = await security.get(id, userId);
};


*/