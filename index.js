"use strict";

import compose from '../../helpers/compose';
import immutableBinding from './immutableBinding';
import guid from '../../helpers/guid';
import generateChangeSet from './generateChangeSet';

import ModelTypes from './ModelTypes'
import Validation from './Validation'

// TODO: do property definition parsing at the end and generate list dynamically
const RESERVED_WORDS = [
  'bind',
  '__bind',
  '__changed',
  '__propChanged',
  '__constructing',
  '__history',
  '__data',
  '__validations',
  '__messages',
  '__rebuildBind',
  '__listeners',
  '__parent',
  '__parentKey',
  '__lastBindState',
  '__changing',
  '__notify',
  'hasChanged',
  'generateChangeSet',
  'validations',
  'messages',
  'isValid',
  'model',
  'undo',
  'redo',
  'clear',
  'patch',
  'hydrate',
  'addListener',
  'removeListener'
];

/**
 * Helper function to create a listener.
 * @param {React.Component} component the component
 * @param {string|function} [opt] either the property to set, or a cb function
 * @param {function} [cb] a cb function
 * @returns {{component: *}}
 */
function createListener(caller, cb) {
  return {
    guid: guid(),
    caller: caller,
    cb: cb
  };
}

/**
 * Creates a new Model
 * @constructor
 */
function Model() {
  return Model.create.apply(this, arguments);
}

/**
 * Quick easy check to see if a constructor is a model or not.
 * @type {boolean}
 */
Model.isModel = true;

/**
 * Store all the models by name for reference.
 * @type {{}}
 */
Model.models = {};

Model.create = function(name, properties, methods, statics) {
  let model = function (data) {
    /**
     * Has the data changed since the last stored state?
     * @type {boolean}
     * @private
     */
    this.__changed = false;

    /**
     * Which properties have changed since the last time the immutable binding was looked at.
     * @type {{}}
     * @private
     */
    this.__propChanged = {};

    /**
     * Is the object currently constructing.
     * @type {boolean}
     * @private
     */
    this.__constructing = true;

    /**
     * Previous values of the data stored in this instance.
     * @type {{}}
     * @private
     */
    this.__history = [];

    /**
     * Internal Data store
     * @type {{}}
     * @private
     */
    this.__data = {};

    /**
     * Internal Validation State
     * @type {{}}
     * @private
     */
    this.__validations = {};

    /**
     * Internal validation message store
     * @type {{}}
     * @private
     */
    this.__messages = {};

    /**
     *  External validation interface
     *  @type {{}}
     */
    this.validations = new this._Validations(this);

    /**
     *  External validation messages interface
     *  @type {{}}
     */
    this.messages = new this._Messages(this);

    /**
     * Does the bind immutable need to be rebuilt. Different then __changed used for pending changes.
     * @type {boolean}
     * @private
     */
    this.__rebuildBind = true;

    /**
     * The most recent copy of the data as an immutable object for binding.
     * @type {{}}
     * @private
     */
    this.__bind = null;

    /**
     * An array of Components that have subscribed to updates of this instance of this Model.
     * @type {Array}
     * @private
     */
    this.__listeners = [];

    /**
     * A reference to the parent object that contains this instance of this Model.
     * @type {Model}
     * @private
     */
    this.__parent = null;

    /**
     * A property key that the parent uses to reference this instance of this Model.
     *
     * //TODO: This probably does not need to exist since we have the data in the Model definitions already.
     * @type {string}
     * @private
     */
    this.__parentKey = null;

    //If data was passed when this instance was instantinated, hydrate that data into the model.
    if (data) this.hydrate(data);

    //Force the immutable bind object to come into existence and also store it for generating change sets.
    this.__lastBindState = this.bind;

    this.__constructing = false;
    return this;
  };

  if (!Object.keys(Model.models).includes(name)) {
    Model.models[name] = model;
  }
  else {
    throw new Error(`Model ${name} has already been defined`);
  }

  /**
   * Quick easy check to see if this JavaScript Object is a Model.
   * @type {boolean}
   */
  model.isModel = true;

  //Remember the name of this Model on its own class for easy reference and serialization later.
  model.model = name;

  //Enable or disable history, can be overwritten by passing in statics.
  model.historyEnabled = false;
  //If history is enabled, how often to batch changeSets in ms?  0 = immediate,
  model.historyInterval = 0;

  /**
   * Static method to generate a changeSet for instances of this model.
   * @type {function(this:model)}
   */
  model.generateChangeSet = function (bind1, bind2) {
    return generateChangeSet(this.def, bind1, bind2, true);
  };


  /**
   * The immutable object is quantum.  Only when you inspect it does it change.
   */
  Object.defineProperty(model.prototype, 'bind', {
    get: immutableBinding,
    configurable: false,
    writeable: false,
    enumerable: false
  });

  /**
   * Generate a changeSet for this instance of this model.
   * @type {function(this:model)}
   */
  model.prototype.generateChangeSet = function () {
    return this.constructor.generateChangeSet(this.__lastBindState, this.bind);
  };

  /**
   * Triggered when a property changes on this instance.
   *
   * @param key the property that is changing
   * @param next the next value that the property will become
   * @private
   */
  model.prototype.__changing = function (key, next) {
    //Virtuals should not trigger the changed flag, as noted above, changed indicates changes that effect data have occurred.
    if (!this.constructor.def[key].virtual) {
      this.__changed = true;
    }

    this.__rebuildBind = true;
    this.__propChanged[key] = true;

    if (this.__constructing) return;

    //Propagate up to parents.
    if (this.__parent) {
      //TODO: Figure out how to propagate this properly, since this instance has not yet been updated it is not "next"
      this.__parent.__changing(this.__parentKey, this);
    }

    //Pool notifying until the end of the cycle.
    if (this.__isNotifying) clearImmediate(this.__isNotifying);

    this.__isNotifying = setImmediate(this.__notify.bind(this));
  };

  /**
   * Update all of the components that are listening for changes to this data.
   * @private
   */
  model.prototype.__notify = function () {
    //Iterate thru all the hooked up listeners for this model.
    this.__listeners.forEach(listener => {
      //If a callback was included, call it with this model.
      if (listener.cb) {
        listener.cb(this);
      }
    });
  };


  Object.defineProperty(model.prototype, 'hasChanges', {
    get: function () {
      return this.__changed;
    },
    configurable: false,
    writeable: false,
    enumerable: false
  });

  model.def = {
    /**
     * Store all the property keys for faster iteration later.
     * @type {[]} keys
     */
    keys: [],
    /**
     * Store the model validator if one was supplied.
     * @type {function} validator
     */
    modelValidator: function() {return true;}
  };

  if (!Array.isArray(properties)) properties = [properties];

  // parse property and check property definition
  properties.forEach(props => {

    for (let key in props) {
      let def;

      //Dev can pass in either a simple type by passing in a primitive, Array, Model or a Function.
      //Or they can pass in an Object with a more complex definition.

      /**
       * Validations can be set on a per property basis or an overall model basis
       * Property validations are run in order defined, then any cross-validations (order not guaranteed)
       * Model validations are only run on a call to .isValid() on the model (order not guaranteed)
       * Validation is lazy, taking the first negative result and stopping the validation execution chain
       *
       * @example
       * let testModel = Model.create(
       *  'Test',
       *  name: String,
       *  favorites: [String],
       *  confirmFavorites: {
       *    type: [String],
       *    virtual: true,
       *  }
       *  password: {
       *    type: String,
       *    validators: [Validation.optional, Validation.password]
       *    validationOptions: [Validation.validateImmediate]
       *  },
       *  confirmPassword: {
       *    type: String,
       *    validators: [Validation.required, Validation.name, {
       *                                                        validator: Validation.confirmPassword,
       *                                                        crossValidation: 'Password'
       *                                                      },
       *    validationOptions: [Validation.validateImmediate, Validation.crossValidateImmediate],
       *    virtual: true
       *  },
       *  {
       *    ...
       *    validate: () => this.isGood && this.date > this.otherDate,
       *    ...
       *  }
       * )
       *
       */

      /*
       * Checks are done in the order of:
       * First: Check if it's a complex definition
       *    -> Unnest the inner type
       * Second: Check if it's an array
       *    -> Unnest the type definition
       *    -> Set isArray flag to true
       * Third: Validate the type itself. Choice of:
       *  A) if it's a valid type (non-array)
       *  B) if it's a string reference to another model (non-array)
       *  C) Hard error out (failed to define or use a complete definition)
       *
       * The final definition (def) should have these properties set:
       * - type
       * - isArray
       * - key
       * - validators [{validator: {validate:Function, message:String}, crossValidation: [] }]
       * - validationOptions
       * - virtual
       * Other properties are initialized but will be set in later sections
       * */
      let type = props[key];

      /* Complex definition processing */
      let validators = []; // validators will be run in order
      let validationOptions = [];
      let formatter = false; // TODO: DATA FORMATTING
      let formatterOptions = false;

      let virtual = false;

      if (type.constructor === Object && type.type) {
        let complexDef = type;
        // Unnest the inner type
        type = complexDef.type;

        // process the validators
        if (complexDef.validators) {
          if (!Array.isArray(complexDef.validators))
            complexDef.validators = [complexDef.validators];

          for (let validator of complexDef.validators) {
            if (!validator) {
              console.warn('Invalid validator for property definition property definition of ' + key + ' on ' + name);
              continue;
            }

            // Validators themselves can also be complex definitions
            let crossValidation = [];
            if (validator.constructor === Object && validator.validator) {
              crossValidation = validator.crossValidation || crossValidation;
              // check that the crossValidation points at properties that are defined
              // if we fail any crossValidation, continue on to the next validator
              if (!crossValidation.every(key => props.hasOwnProperty(key))) {
                console.warn('Invalid cross-validation for property definition of ' + key + ' on ' + name);
                continue;
              }
              validator = validator.validator;
            }

            if (Validation.isValidValidator(validator)) {
              // validator is an approved validator
              // add validator and associated options
              validators.push({validator: validator, crossValidation: crossValidation});

            }
            else {
              console.warn('Invalid validator for property definition of ' + key + ' on ' + name);
              continue; //explicit continue
            }

          }
        }

        // process validationOptions
        if (complexDef.validationOptions) {
          if (!Array.isArray(complexDef.validationOptions))
            complexDef.validationOptions = [complexDef.validationOptions];

          if (!complexDef.validationOptions.every(option => Validation.isValidValidationOption(option)))
            console.warn('Invalid validationOption for property definition of ' + key + ' on ' + name);

          validationOptions = complexDef.validationOptions.filter(option => Validation.isValidValidationOption(option));

        }

        // process the formatters
        // TODO: Implement formatters
        if (complexDef.formatters) {

        }

        // Pass through for other complex definition options
        virtual = Boolean(complexDef.virtual);

      }

      /* Array Denesting */
      let isArray = Array.isArray(type);

      if (isArray) {
        if (type.length > 0) {
          type = type[0];
        }
        else {
          throw new Error(`"type" of "${type}" not provided or invalid for property definition of "${key}" on "${name}"`);
        }
      }

      /* ModelType Checking */
      if (ModelTypes.isValidType(type)) {
        // do nothing, type is already set correctly
      }
      else if (typeof(type) === 'string' && Model.models.hasOwnProperty(type)) {
        //Allow for types to be referenced by string.  This would probably only be used when a Model is referencing
        //itself, or if there is a cyclic dependency of Models.
        type = Model.models[type];
      }
      else {
        // YOU SHALL NOT PASS
        throw new Error(`"type" of "${type}" not provided or invalid for property definition of "${key}" on "${name}"`);
      }

      def = {
        key: key,                             // The name of the property
        type: type,                           // The type of the property
        validate: () => true,                 // The validation function of the property (no params
        crossValidate: [],                    // Any validation functions to be called, requested by other properties
        modelValidate: [],                    // Any validation functions to be called, requested by overall model
        validators: validators,               // Collection of validators attached to the property
        validationOptions: validationOptions, // Collection of options on how/when validators are called
        isArray: isArray,                      // Whether this property is an array
        virtual: virtual
      };

      // def IS PROPERLY SET (all data is clean, functions have not been set up yet)
      // USE def FROM THIS POINT FORWARD

      // Do a sanity check to make sure we don't duplicate keys
      if (model.def.keys.includes(def.key)) {
        throw new Error('Duplicate key "' + def.key + '" defined in ' + name);
      }

      // Certain reserved properties that can't be used in model definitions
      if (RESERVED_WORDS.includes(def.key)) {
        throw new Error(`Reserved property name "${def.key}" used in property definition of ${name}`);
      }

      model.def[def.key] = def;
      model.def.keys.push(def.key);

    }
  });

  // Set up validate functions
  // Validation must be done after processing the entire definition to allow for cross validation
  /**
   * Each property definition currently has filled:
   *  - key
   *  - validators
   *  - validationOptions
   *  <others>
   *
   *  New properties on validators objects:
   *  - validate { Function }
   *  - message { String }
   *
   *  New properties on definitions:
   *  - validate { Function }
   *  - crossValidate [{key: String, validate: Function, validationOptions: []}]
   *  - modelValidate [{key: 'model', validate: Function, validationOptions: []}]
   *
   *  New properties on model definition
   *  - modelValidator {function}
   *
   *  This next section:
   *  First:  Adds a validate function to each validator on each property
   *  Second: Amalgamate all validator functions into a single validate function for the property
   *          and attaches the validate function to  the property and any cross validate properties
   *  Third:  Overlays the setter with any validate or cross-validate functions
   *          including any overall model validation functions
   */

  for (let key of model.def.keys) {

    let def = model.def[key];

    // Process isRequired convenience flag
    if (def.validationOptions.includes(Validation.isRequired)
        && !def.validators.includes(Validation.required)) {
      validators.shift(Validation.required);
    }

    if (def.validators.length > 0) {
      let validators = def.validators; // validator definitions
      let isOptional = def.validationOptions.includes(Validation.isOptional);
      let isOptionalShortCircuit = () => false; // returns whether can skip the validators
      
      // setup the validator validate
      for (let validatorDef of validators) {
        let crossValidation = validatorDef.crossValidation;
        let funcArgs = [key, ... crossValidation];

        // Create the validate function for the specific validator
        let validate = function () {
          let args = funcArgs.map(key => this.__data[key]);
          return validatorDef.validator.validate.call(this, ... args);
        };

        validatorDef.validate = validate;
        validatorDef.message = validatorDef.validator.message;
      }
      // end of validator validate set up
      
      // setup optional validator
      if (isOptional) {
        isOptionalShortCircuit = function () {
          let arg = this.__data[key];
          return Validation.empty.validate.call(this, arg);
        }
      }
      // end optional setup

      // set up overall property validate function
      let propValidate = function () {
        let state = true;
        let message = '';
        
        if (!isOptionalShortCircuit.call(this)) {
          for (let validatorDef of validators) {
            if (!validatorDef.validate.call(this)) { // if any validation fails, auto fail
              // Set the property error message to the failed validator error message
              state = false;
              message = validatorDef.message;
              break;
            }
          }
        }

        this.__validations[key] = state;
        this.__messages[key] = message;

        return state;

      };

      def.validate = propValidate;
      // end of property validator setup

      // attach validate function on any cross-validated properties as requested
      for (let validator of validators) {
        let crossValidation = validator.crossValidation;
        for (let crossKey of crossValidation) {
          model.def[crossKey].crossValidate.push({
            key: key,
            validate: propValidate,
            validationOptions: (def.validationOptions.includes(Validation.crossValidateImmediate)
                ? Validation.validateImmediate
                : []
            )
          });
        }
      }

    }
  }

  // END Property validation function creation

  // Attach the getters and setters to each property
  for (let key of model.def.keys) {
    let def = model.def[key];
    let setter = ModelTypes.getTypeSetter(def.type, def.isArray);
    setter = setter(def.key, def);

    //TODO: this currently runs through entire array of validators all the time. Make it better.
    let propSetter = function (val) {

      setter.call(this, val); // Set the value in the underlying data store

      // run validation if requested
      if (def.validationOptions.includes(Validation.validateImmediate))
        def.validate.call(this);

      // run crossValidation if requested
      def.crossValidate.forEach(crossVal =>
        ( crossVal.validationOptions.includes(Validation.validateImmediate)
            ? crossVal.validate.call(this)
            : false
        )
      );

      // run modelValidation if requested
      def.modelValidate.forEach(modelVal =>
        ( modelVal.validationOptions.includes(Validation.validateImmediate)
            ? modelVal.validate.call(this)
            : false
        )
      );

    };

    Object.defineProperty(model.prototype, def.key, {
      get: function () {
        return this.__data[def.key];
      },
      set: propSetter,
      configurable: true
    });
  }

  /**
   * This section provides the public facing interface for accessing
   * validation states and messages that are produced from validation functions.
   * Each of _Validations and _Messages has properties defined depending on
   * host Model definition. The class definitions are then frozen.
   */

  /**
   * Provides a public interface for validations.
   * @type {Class}
   * @private
   */
  // Bind the external validation interface
  // Do this using an inner class defined per model
  model.prototype._Validations = function (modelInstance) {
    this.__modelInstance = modelInstance;
    Object.defineProperty(this, '__modelInstance', {
      enumerable: false
    });
  };

  model.prototype._Messages = function (modelInstance) {
    this.__modelInstance = modelInstance;
    Object.defineProperty(this, '__modelInstance', {
      enumerable: false
    });
  };

  model.prototype._Validations.keys = [];
  model.prototype._Messages.keys = [];

  // Attach the messages access point to validations for easier access
  Object.defineProperty(model.prototype._Validations.prototype, 'messages', {
    get: function () {
      return this.__modelInstance.messages;
    },
    configurable: false,
    writeable: false,
    enumerable: false
  });

  for (let key of model.def.keys) {
    // if the property has no validators attached to it, it doesn't have a validation state
    if (model.def[key].validators.length === 0)
      continue;

    // get the state of validation
    Object.defineProperty(model.prototype._Validations.prototype, key, {
      get: function () {
        return this.__modelInstance.__validations[key];
      },
      configurable: false,
      writeable: false,
      enumerable: true
    });

    model.prototype._Validations.keys.push(key);

    Object.defineProperty(model.prototype._Messages.prototype, key, {
      get: function () {
        return this.__modelInstance.__messages[key];
      },
      configurable: false,
      writeable: false,
      enumerable: true
    });

    model.prototype._Messages.keys.push(key);

  }

  // The validations and messages classes should be immutable from this point forward
  model.prototype._Validations.prototype = Object.freeze(model.prototype._Validations.prototype);
  model.prototype._Messages.prototype = Object.freeze(model.prototype._Messages.prototype);


  /**
   * Validates a specific or all properties on the model
   * @param {String} [keyToCheck] Optional. Validates the given prop, if omitted
   *                                 validates the entire model
   */
  model.prototype.validate = function (keyToCheck) {
    let keys = this.constructor.def.keys;

    if (keyToCheck) {
      if (keys.includes(keyToCheck)) {
        return this.constructor.def[keyToCheck].validate.call(this);
      }

      throw new Error('Key "' + keyToCheck + '" does not exist on model ' + this.constructor.name);
    }

    let state = true;

    for (let key of keys) {
      let def = this.constructor.def[key];
      state = ( state && def.validate.call(this) ); // if ANY return false it's false
    }

    let modelState = this.constructor.def.modelValidator.call(this);

    return ( state && modelState );
  };

  /**
   * Checks to see if values are valid
   * @param {String} [key] Optional. Returns the validation state of that specific key,
   *                                 if omitted returns overall model validation state.
   * @returns {Boolean}
   */
  model.prototype.isValid = function (key) {
    // Check if a specific field is valid
    return this.validate.call(this, key);
  };


  /**
   * Remove a Component from listening for changes.
   * @param idToRemove The ID of the listener to remove
   * @returns {Array.<*>}
   */
  model.prototype.removeListener = function (idToRemove) {
    if (!idToRemove) return null;

    let ix = this.__listeners.findIndex(listener => listener.guid === idToRemove);

    return (ix > -1) ? this.__listeners.splice(ix, 1) : null;
  };

  /**
   * Add a Component that will now listen for changes to the data in this instance.
   * @param component {React.Component} The component to notify
   * @param [opt] {string|function} An optional option, either a string that defines the property property on state to set, or cb if omitted
   * @param [cb] {function} a cb for when this model is updated.
   * @returns {Number}
   */
  model.prototype.addListener = function (component, cb) {
    let listener = createListener(component, cb);
    this.__listeners.push(listener);
    return listener.guid;
  };

  /**
   * toJSON will return the immutable object.
   *
   * @returns {{}}
   */
  model.prototype.toJSON = function () {
    return this.bind;
  };

  /**
   * Resets this model to its last committed state, most likely it's constructed state.  Could be it's last save point.
   */
  model.prototype.reset = function (full) {
    this.__rebuildBind = true;
    this.__propChanged = {};
    this.__history = [];
    this.__bind = null;

    this.constructor.def.keys.forEach(key => this[key] = this.__lastBindState && !full ? this.__lastBindState[key] : undefined);

    this.__lastBindState = this.bind;
    this.__changed = false;
  };

  /**
   * Go back one committed state.
   */
  model.prototype.undo = function () {
    console.warn('//TODO: model.prototype.undo not implemented yet.');
  };

  /**
   * Undo an undo.
   */
  model.prototype.redo = function () {
    console.info('//TODO: model.prototype.redo not implemented yet.');
  };

  /**
   * Clear out all the data in this object.  This does NOT reset this instance to is original state.
   */
  model.prototype.clear = function () {
    this.constructor.def.keys.forEach(key => this[key] = undefined);
  };

  /**
   * Apply a subset of data to this instance of this model.
   * @param props
   */
  model.prototype.patch = function (props) {
    this.constructor.def.keys.forEach(key => {
      if (props[key] !== undefined) {
        this[key] = props[key];
      }
    });
  };

  /**
   * Populate an instance with a whole new instance of a model.
   * @param props
   */
  model.prototype.hydrate = function (props) {
    this.reset();
    this.patch((this._constructor ? this._constructor(props) : props));
    this.__lastBindState = this.bind;
    this.__changed = false;
  };

  //Compose any instance methods that have been supplied for this model.
  if (methods) {

    if (!Array.isArray(methods)) methods = [methods];

    //Pull out the last inherited 'validate' function and store it, this is the model validator.
    for (let methodComposition of methods) {
      for (let key in methodComposition) {
        if (key === 'validate') {
          model.def.modelValidator = methodComposition[key];
        }
      }
    }

    compose(model.prototype, methods);
  }

  //Compose any static methods that have been supplied for this model.
  if (statics) {
    compose(model, statics);
  }

  return model;
};

export default Model;