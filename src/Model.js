"use strict";

import {EventEmitter} from 'fbemitter';

import compose from './lib/compose';
import immutableBinding from './immutableBinding';
import guid from './lib/guid';
import checkPropertyNames from './lib/checkPropertyNames';

import generateChangeSet from './generateChangeSet';
//TODO: Remove once v3.0.0 API is rolled out to production.
import generateChangeSetV0 from './generateChangeSetV0';

import ModelTypes from './ModelTypes'
import Validation from './Validation'

/**
 * Creates a new Model
 * @constructor
 */
function Model() {
  return Model.create.apply(this, arguments);
}

Model.Validation = Validation;

Model.guid = guid;

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

/**
 * Creates a new Model.
 *
 * @param name
 * @param properties
 * @param methods
 * @param statics
 * @returns {model}
 */
Model.create = function(name, properties, methods, statics) {
  let model = function (data) {
    /**
     * An event emitter.
     */
    this.__emitter = new EventEmitter();

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
     * Which properties have changed since the last notify.
     * @type {{}}
     * @private
     */
    this.__propShouldNotify = {};

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
     * Does the bind immutable need to be rebuilt. Different then __changed used for pending changes.
     * @type {boolean}
     * @private
     */
    this.__rebuildImmutable = true;

    /**
     * The most recent copy of the data as an immutable object for binding.
     * @type {{}}
     * @private
     */
    this.__immutable = null;

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

    this.__guid = guid();

    //Set any initial values.
    for (let key of this.constructor.def.keys) {
      if (this.constructor.def[key].initial) {
        this[key] = this.constructor.def[key].initial;
      }
    }

    //If data was passed when this instance was instantinated, hydrate that data into the model.
    if (data) {
      this.hydrate(data);
    }

    //Force the immutable bind object to come into existence and also store it for generating change sets.
    this.__lastImmutable = this.immutable;

    this.__constructing = false;

    return this;
  };

  if (Object.keys(Model.models).includes(name)) {
    throw new Error(`Model ${name} has already been defined`);
  }

  Model.models[name] = model;

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
  //Notify interval can be tweaked for performance tuning.
  model.notifyInterval = 0;

  /**
   * Static method to generate a changeSet for instances of this model.
   * @type {function(this:model)}
   */
  model.generateChangeSet = function (bind1, bind2) {
    return generateChangeSet(this.def, bind1, bind2, true);
  };

  /**
   * Static method to generate a changeSet for instances of this model.
   * @type {function(this:model)}
   * @deprecated since v3.0.0+
   */
  model.generateChangeSetV0 = function (bind1, bind2) {
    return generateChangeSetV0(this.def, bind1, bind2);
  };

  /**
   * The immutable object is quantum.  Only when you inspect it does it change.
   */
  Object.defineProperty(model.prototype, 'immutable', {
    get: immutableBinding,
    configurable: false,
    writeable: false,
    enumerable: false
  });

  Object.defineProperty(model.prototype, 'validations', {
    get: function() {
      return this.__validations;
    },
    configurable: false,
    writeable: false,
    enumerable: false
  });

  Object.defineProperty(model.prototype, 'messages', {
    get: function() {
      return this.__messages;
    },
    configurable: false,
    writeable: false,
    enumerable: false
  });

  /**
   * Generate a changeSet for this instance of this model.
   * @type {function(this:model)}
   */
  model.prototype.generateChangeSet = function () {
    return this.constructor.generateChangeSet(this.__lastImmutable, this.immutable);
  };

  /**
   * Generate a changeSet for this instance of this model.
   * @type {function(this:model)}
   * @deprecated since v3.0.0+
   */
  model.prototype.generateChangeSetV0 = function () {
    return this.constructor.generateChangeSetV0(this.__lastImmutable, this.immutable);
  };

  /**
   * Triggered when a property has changed on this instance
   *
   * @param key The property that has changed
   * @param val The new value
   * @param [event] Any event details associated with the change
   * @private
   */
  model.prototype.__onChanged = function (key, val, event) {
    let def = this.constructor.def[key];

    //Virtuals should not trigger the changed flag, as noted above, changed indicates changes that effect data have occurred.
    if (!def.virtual) {
      this.__changed = true;
    }

    //Sometimes the dev may set notify to false, this short circuits any change notification.
    if (!def.notify) {
      return;
    }

    this.__rebuildImmutable = true;
    this.__propChanged[key] = true;
    this.__propShouldNotify[key] = true;

    if (this.__constructing) return;

    if (!this.__isNotifying) {
      if (this.constructor.notifyInterval > 0) {
        //notifyInterval can be used for specific performance tuning.
        this.__isNotifying = setTimeout(this.__notify.bind(this), this.constructor.notifyInterval);
      } else {
        //setImmediate will pool notifying until the end of the execution cycle.
        this.__isNotifying = setImmediate(this.__notify.bind(this));
      }
    }

    //Propagate up to parents if it needs to be propagated
    if (this.__parent) {
      this.__parent.__onChanged(this.__parentKey, this, event);
    }
  };

  /**
   * Update all of the components that are listening for changes to this data.
   * @private
   */
  model.prototype.__notify = function () {
    this.emit('changed', this);

    for (let key of this.constructor.def.keys) {
      if (this.__propShouldNotify[key]) {
        this.emit(`${key}Changed`, this);
      }
    }

    this.__propShouldNotify = {};
    this.__isNotifying = null;
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
    keys: []
  };

  /**
   * Validates a specific or all properties on the model
   * @param {String} [keyToCheck] Optional. Validates the given prop, if omitted
   *                                 validates the entire model
   */
  model.prototype.validate = function (keyToCheck) {
    //TODO: cache validation since last change.  There is no need to re-run this validation unless something has changed.

    if (keyToCheck) {
      return this.constructor.def[keyToCheck].validate.call(this);
    }

    let state = true;

    for (let key of this.constructor.def.keys) {
      // if ANY return false it's false
      state = state && this.constructor.def[key].validate.call(this);
    }

    //let modelState = this.constructor.def.modelValidator.call(this);

    return state;
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
   * Removes all event listeners on this model.
   * @returns {*}
   */
  model.prototype.removeAllListeners = function() {
    return this.__emitter.removeAllListeners();
  };

  /**
   * Adds a callback to be executed when this model is updated
   * @param [cb] {Function} a cb for when this model is updated.
   * @returns {String}
   */
  model.prototype.addListener = function (cb, key) {
    //TODO: fix this since it is kind of weird now.
    if (typeof cb === 'function') {
      return this.__emitter.addListener(key ? `${key}Changed` : 'changed', cb);
    } else if (typeof cb === 'string') {
      return this.__emitter.addListener(cb, key);
    }
  };

  /**
   * Adds a callback to be executed when this model is updated that is removed immediatley after it is called.
   * @param [cb] {Function} a cb for when this model is updated.
   * @returns {String}
   */
  model.prototype.addOnce = function (cb, key) {
    return this.__emitter.once(key ? `${key}Changed` : 'changed', cb);
  };

  model.prototype.emit = function(event, data) {
    return this.__emitter.emit(event, data);
  };

  /**
   * toJSON will return the immutable object.
   *
   * @returns {{}}
   */
  model.prototype.toJSON = function () {
    return this.immutable;
  };

  /**
   * Resets this model to its last committed state, most likely it's constructed state.  Could be it's last save point.
   */
  model.prototype.reset = function (full) {
    this.__rebuildImmutable = true;
    this.__propChanged = {};
    this.__propShouldNotify = {};
    this.__history = [];
    this.__immutable = null;

    this.constructor.def.keys.forEach(key => this[key] = this.__lastImmutable && !full ? this.__lastImmutable[key] : undefined);

    this.__lastImmutable = this.immutable;
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
    this.__changed = false;
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
    this.__lastImmutable = this.immutable;
    this.__changed = false;
  };

  /**
   * Built-in properties have been set up,
   * Construct the reserved words list to ensure no conflicts between built-in props and defined props/methods
   */

  const RESERVED_WORDS = Object.getOwnPropertyNames(new model());
  const STATIC_RESERVED_WORDS = Object.getOwnPropertyNames(model.prototype);

  /**
   * BOILERPLATE MODEL CODE IS ABOVE THIS POINT - MODEL SPECIFIC DEFINITIONS CODE IS BELOW THIS POINT
   */
  if (!Array.isArray(properties))  {
    properties = [properties];
  }

  // parse property and check property definition
  properties.forEach(props => {

    for (let key in props) {
      //Dev can pass in either a simple type by passing in a primitive, Array, Model or a Function.
      //Or they can pass in an Object with a more complex definition.
      let type = props[key];
      //Setup a blank validation function for each of use later.
      let validate = () => true;
      //validators will be run in order
      let validators = [];
      let virtual = false;
      let complexDef = {};
      let notify = true;
      let isRequired = false;
      let auto = undefined;
      let initial = undefined;

      if (type.constructor === Object && type.type) {
        complexDef = type;

        // Unnest the inner type
        type = complexDef.type;

        //Setup validation function for this prop.
        if (complexDef.validators) {
          validators = Array.isArray(complexDef.validators) ? complexDef.validators : [complexDef.validators];

          let ixIsRequired = validators.findIndex(validator => validator === Validation.required);

          //Required is a special validator.  Pull it out of the array and set a flag for use later.
          if (ixIsRequired > -1) {
            isRequired = true;
            validators.splice(ixIsRequired, 1);
          }

          validate = function() {
            let def = this.constructor.def[key];
            let state = true;
            let message;

            let hasValue = Validation.required.validate.call(this, this.__data[key]);

            if (def.isRequired && !hasValue) {
              //If this is required and it is empty, validation fails.
              state = false;
              message = Validation.required.message;
            } else if (!def.isRequired && !hasValue) {
              //If this is NOT required, and has no value, then it is by default, valid.
              state = true;
            } else {
              for (let validator of def.validators) {
                if (!validator.validate.call(this, this.__data[key])) {
                  state = false;
                  message = validator.message;
                  break;
                }
              }
            }

            this.__validations[key] = state;
            this.__messages[key] = message;

            return state;
          };
        }

        // Pass through for other complex definition options
        if (complexDef.virtual === true) {
          virtual = true;
        }

        if (complexDef.notify === false) {
          notify = false;
        }

        //TODO: may want to do some more checking here, like does the definition specific an auto value that matches the type?
        if (complexDef.auto !== undefined) {
          auto = complexDef.auto;
        }

        //TODO: may want to do some more checking here, like does the definition specific an auto value that matches the type?
        if (complexDef.initial !== undefined) {
          initial = complexDef.initial;
        }
      }

      /* Array Denesting */
      let isArray = Array.isArray(type);

      if (isArray) {
        type = type[0];
      }

      if (typeof(type) === 'string' && Model.models.hasOwnProperty(type)) {
        //Allow for types to be referenced by string.  This would probably only be used when a Model is referencing
        //itself, or if there is a cyclic dependency of Models.
        type = Model.models[type];
      }

      let def = {
        ... complexDef,                       // Let the dev setup their own properties
        key: key,                             // The name of the property
        type: type,                           // The type of the property
        validate: validate,                   // The validation function of the property
        validators: validators,               // Collection of validators attached to the property
        isArray: isArray,                     // Whether this property is an array
        virtual: virtual,                     // Does this property persist to a data store? Or is it used for other purposes.
        isRequired: isRequired,               // is this property required.
        notify: notify,                       // when this property is changed, should it trigger a notify
        initial: initial,                     // what is the value this property should be initialized to?
        auto: auto                            // what value will this take one after being set to null?

      };

      // def IS PROPERLY SET (all data is clean, functions have not been set up yet)

      // Do a sanity check to make sure we don't duplicate keys
      if (model.def.keys.includes(def.key)) {
        throw new Error(`Duplicate property name "${def.key}" defined in ${name}`);
      }

      // Certain reserved properties that can't be used in model definitions
      if (RESERVED_WORDS.includes(def.key)) {
        throw new Error(`Reserved property name "${def.key}" used in property definition of ${name}`);
      }

      model.def[def.key] = def;
      model.def.keys.push(def.key);

      let setter = (ModelTypes.getTypeSetter(def))(def.key, def);

      Object.defineProperty(model.prototype, def.key, {
        get: function () {
          return this.__data[def.key];
        },
        set: function(val) {
          setter.call(this, val);
          def.validate.call(this);
        },
        configurable: true
      });
    }
  });

  //Compose any instance methods that have been supplied for this model.
  if (methods) {
    let _methods =  Array.isArray(methods) ? methods : [methods];
    checkPropertyNames(_methods,  RESERVED_WORDS);
    compose(model.prototype, _methods);
  }

  //Compose any static methods that have been supplied for this model.
  if (statics) {
    let _statics = Array.isArray(statics) ? statics : [statics];
    checkPropertyNames(_statics, STATIC_RESERVED_WORDS);
    compose(model, _statics);
  }

  return model;
};

export default Model;