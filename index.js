/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty = __webpack_require__(2);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	var _freeze = __webpack_require__(20);

	var _freeze2 = _interopRequireDefault(_freeze);

	var _getOwnPropertyNames = __webpack_require__(27);

	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

	var _toConsumableArray2 = __webpack_require__(44);

	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

	var _getIterator2 = __webpack_require__(69);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _setImmediate2 = __webpack_require__(76);

	var _setImmediate3 = _interopRequireDefault(_setImmediate2);

	var _keys = __webpack_require__(81);

	var _keys2 = _interopRequireDefault(_keys);

	var _compose = __webpack_require__(84);

	var _compose2 = _interopRequireDefault(_compose);

	var _immutableBinding = __webpack_require__(90);

	var _immutableBinding2 = _interopRequireDefault(_immutableBinding);

	var _guid = __webpack_require__(91);

	var _guid2 = _interopRequireDefault(_guid);

	var _generateChangeSet = __webpack_require__(92);

	var _generateChangeSet2 = _interopRequireDefault(_generateChangeSet);

	var _generateChangeSetV = __webpack_require__(98);

	var _generateChangeSetV2 = _interopRequireDefault(_generateChangeSetV);

	var _ModelTypes = __webpack_require__(99);

	var _ModelTypes2 = _interopRequireDefault(_ModelTypes);

	var _Validation = __webpack_require__(122);

	var _Validation2 = _interopRequireDefault(_Validation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


	//TODO: Remove once v3.0.0 API is rolled out to production.
	Model.isModel = true;

	/**
	 * Store all the models by name for reference.
	 * @type {{}}
	 */
	Model.models = {};

	Model.create = function (name, properties, methods, statics) {
	  var model = function model(data) {
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

	    this.__guid = (0, _guid2.default)();

	    //If data was passed when this instance was instantinated, hydrate that data into the model.
	    if (data) this.hydrate(data);

	    //Force the immutable bind object to come into existence and also store it for generating change sets.
	    this.__lastBindState = this.bind;

	    this.__constructing = false;

	    return this;
	  };

	  if (!(0, _keys2.default)(Model.models).includes(name)) {
	    Model.models[name] = model;
	  } else {
	    throw new Error('Model ' + name + ' has already been defined');
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
	  //Notify interval can be tweaked for performance tuning.
	  model.notifyInterval = 0;
	  /**
	   * Static method to generate a changeSet for instances of this model.
	   * @type {function(this:model)}
	   */
	  model.generateChangeSet = function (bind1, bind2) {
	    return (0, _generateChangeSet2.default)(this.def, bind1, bind2, true);
	  };

	  /**
	   * Static method to generate a changeSet for instances of this model.
	   * @type {function(this:model)}
	   * @deprecated since v3.0.0+
	   */
	  model.generateChangeSetV0 = function (bind1, bind2) {
	    return (0, _generateChangeSetV2.default)(this.def, bind1, bind2);
	  };

	  /**
	   * The immutable object is quantum.  Only when you inspect it does it change.
	   */
	  Object.defineProperty(model.prototype, 'bind', {
	    get: _immutableBinding2.default,
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
	   * Generate a changeSet for this instance of this model.
	   * @type {function(this:model)}
	   * @deprecated since v3.0.0+
	   */
	  model.prototype.generateChangeSetV0 = function () {
	    return this.constructor.generateChangeSetV0(this.__lastBindState, this.bind);
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
	    //Virtuals should not trigger the changed flag, as noted above, changed indicates changes that effect data have occurred.
	    if (!this.constructor.def[key].virtual) {
	      this.__changed = true;
	    }

	    this.__rebuildBind = true;
	    this.__propChanged[key] = true;

	    if (this.__constructing) return;

	    /* If a notification is already pending, then another onChanged has already walked up this path. This implies:
	    *   1) You don't need to continue notifying the parent models since that's already been done by someone else
	    *   2) If this is a circular chain somehow, the first time you visit this node on the graph scheduled the notification
	    */
	    var notificationsPending = this.__isNotifying;

	    if (!notificationsPending) {
	      if (this.constructor.notifyInterval > 0) {
	        //notifyInterval can be used for specific performance tuning.
	        this.__isNotifying = setTimeout(this.__notify.bind(this), this.constructor.notifyInterval);
	      } else {
	        //setImmediate will pool notifying until the end of the execution cycle.
	        this.__isNotifying = (0, _setImmediate3.default)(this.__notify.bind(this));
	      }
	    }

	    //Propagate up to parents if it needs to be propogated
	    if (this.__parent) {
	      this.__parent.__onChanged(this.__parentKey, this, event);
	    }
	  };

	  /**
	   * Update all of the components that are listening for changes to this data.
	   * @private
	   */
	  model.prototype.__notify = function () {
	    var _this = this;

	    //Iterate thru all the hooked up listeners for this model.
	    this.__listeners.forEach(function (listener) {
	      //If a callback was included, call it with this model.
	      if (listener.cb) {
	        listener.cb(_this);
	      }
	    });

	    this.__isNotifying = null;
	  };

	  Object.defineProperty(model.prototype, 'hasChanges', {
	    get: function get() {
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
	    modelValidator: function modelValidator() {
	      return true;
	    }
	  };

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

	  /**
	   * Validates a specific or all properties on the model
	   * @param {String} [keyToCheck] Optional. Validates the given prop, if omitted
	   *                                 validates the entire model
	   */
	  model.prototype.validate = function (keyToCheck) {
	    //TODO: cache validation since last change.  There is no need to re-run this validation unless something has changed.

	    var keys = this.constructor.def.keys;

	    if (keyToCheck) {
	      if (keys.includes(keyToCheck)) {
	        return this.constructor.def[keyToCheck].validate.call(this);
	      }

	      throw new Error('Key "' + keyToCheck + '" does not exist on model ' + this.constructor.name);
	    }

	    var state = true;

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var key = _step.value;

	        var def = this.constructor.def[key];
	        state = state && def.validate.call(this); // if ANY return false it's false
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    var modelState = this.constructor.def.modelValidator.call(this);

	    return state && modelState;
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
	   * Remove a callback from listening for changes.
	   * @param idToRemove The ID of the listener to remove
	   * @returns {Array.<*>}
	   */
	  model.prototype.removeListener = function (idToRemove) {
	    if (!idToRemove) return null;

	    var ix = this.__listeners.findIndex(function (listener) {
	      return listener.guid === idToRemove;
	    });

	    return ix > -1 ? this.__listeners.splice(ix, 1) : null;
	  };

	  /**
	   * Adds a callback to be executed when this model is updated
	   * @param [cb] {Function} a cb for when this model is updated.
	   * @returns {String}
	   */
	  model.prototype.addListener = function (cb) {
	    if (!cb) return null;
	    var listener = { guid: (0, _guid2.default)(), cb: cb };
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
	    var _this2 = this;

	    this.__rebuildBind = true;
	    this.__propChanged = {};
	    this.__history = [];
	    this.__bind = null;

	    this.constructor.def.keys.forEach(function (key) {
	      return _this2[key] = _this2.__lastBindState && !full ? _this2.__lastBindState[key] : undefined;
	    });

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
	    var _this3 = this;

	    this.constructor.def.keys.forEach(function (key) {
	      return _this3[key] = undefined;
	    });
	    this.__changed = false;
	  };

	  /**
	   * Apply a subset of data to this instance of this model.
	   * @param props
	   */
	  model.prototype.patch = function (props) {
	    var _this4 = this;

	    this.constructor.def.keys.forEach(function (key) {
	      if (props[key] !== undefined) {
	        _this4[key] = props[key];
	      }
	    });
	  };

	  /**
	   * Populate an instance with a whole new instance of a model.
	   * @param props
	   */
	  model.prototype.hydrate = function (props) {
	    this.reset();
	    this.patch(this._constructor ? this._constructor(props) : props);
	    this.__lastBindState = this.bind;
	    this.__changed = false;
	  };

	  /**
	   * Built-in properties have been set up,
	   * Construct the reserved words list to ensure no conflicts between built-in props and defined props/methods
	   */

	  var RESERVED_WORDS = function () {
	    var _instanceProps = [].concat((0, _toConsumableArray3.default)((0, _getOwnPropertyNames2.default)(new model())));
	    var _staticProps = [].concat((0, _toConsumableArray3.default)((0, _getOwnPropertyNames2.default)(model.prototype)));

	    // Check if there are conflicts in instance and static naming
	    // A intersect B = B intersect A
	    _instanceProps.forEach(function (x) {
	      if (_staticProps.includes(x)) throw new Error('Conflict in instance and static built-in properties, ');
	    });

	    return [].concat((0, _toConsumableArray3.default)(_instanceProps), (0, _toConsumableArray3.default)(_staticProps));
	  }();

	  /**
	   * BOILERPLATE MODEL CODE IS ABOVE THIS POINT
	   * MODEL SPECIFIC DEFINITIONS CODE IS BELOW THIS POINT
	   */

	  if (!Array.isArray(properties)) properties = [properties];

	  // parse property and check property definition
	  properties.forEach(function (props) {

	    for (var key in props) {
	      var def = void 0;

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
	      var type = props[key];

	      /* Complex definition processing */
	      var _validators = []; // validators will be run in order
	      var validationOptions = [];
	      var formatter = false; // TODO: DATA FORMATTING
	      var formatterOptions = false;

	      var virtual = false;

	      if (type.constructor === Object && type.type) {
	        var complexDef = type;
	        // Unnest the inner type
	        type = complexDef.type;

	        // process the validators
	        if (complexDef.validators) {
	          if (!Array.isArray(complexDef.validators)) complexDef.validators = [complexDef.validators];

	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;

	          try {
	            for (var _iterator2 = (0, _getIterator3.default)(complexDef.validators), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              var validator = _step2.value;

	              if (!validator) {
	                console.warn('Invalid validator for property definition of ' + key + ' on ' + name);
	                continue;
	              }

	              // Validators themselves can also be complex definitions
	              var crossValidation = [];
	              if (validator.constructor === Object && validator.validator) {
	                crossValidation = validator.crossValidation || crossValidation;
	                // check that the crossValidation points at properties that are defined
	                // if we fail any crossValidation, continue on to the next validator
	                if (!crossValidation.every(function (key) {
	                  return props.hasOwnProperty(key);
	                })) {
	                  console.warn('Invalid cross-validation for property definition of ' + key + ' on ' + name);
	                  continue;
	                }
	                validator = validator.validator;
	              }

	              if (_Validation2.default.isValidValidator(validator)) {
	                // validator is an approved validator
	                // add validator and associated options
	                _validators.push({ validator: validator, crossValidation: crossValidation });
	              } else {
	                console.warn('Invalid validator for property definition of ' + key + ' on ' + name);
	                continue; //explicit continue
	              }
	            }
	          } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	              }
	            } finally {
	              if (_didIteratorError2) {
	                throw _iteratorError2;
	              }
	            }
	          }
	        }

	        // process validationOptions
	        if (complexDef.validationOptions) {
	          if (!Array.isArray(complexDef.validationOptions)) complexDef.validationOptions = [complexDef.validationOptions];

	          if (!complexDef.validationOptions.every(function (option) {
	            return _Validation2.default.isValidValidationOption(option);
	          })) console.warn('Invalid validationOption for property definition of ' + key + ' on ' + name);

	          validationOptions = complexDef.validationOptions.filter(function (option) {
	            return _Validation2.default.isValidValidationOption(option);
	          });
	        }

	        // process the formatters
	        // TODO: Implement formatters
	        if (complexDef.formatters) {}

	        // Pass through for other complex definition options
	        virtual = Boolean(complexDef.virtual);
	      }

	      /* Array Denesting */
	      var isArray = Array.isArray(type);

	      if (isArray) {
	        if (type.length > 0) {
	          type = type[0];
	        } else {
	          throw new Error('"type" of "' + type + '" not provided or invalid for property definition of "' + key + '" on "' + name + '"');
	        }
	      }

	      /* ModelType Checking */
	      if (_ModelTypes2.default.isValidType(type)) {
	        // do nothing, type is already set correctly
	      } else if (typeof type === 'string' && Model.models.hasOwnProperty(type)) {
	        //Allow for types to be referenced by string.  This would probably only be used when a Model is referencing
	        //itself, or if there is a cyclic dependency of Models.
	        type = Model.models[type];
	      } else {
	        // YOU SHALL NOT PASS
	        throw new Error('"type" of "' + type + '" not provided or invalid for property definition of "' + key + '" on "' + name + '"');
	      }

	      def = {
	        key: key, // The name of the property
	        type: type, // The type of the property
	        validate: function validate() {
	          return true;
	        }, // The validation function of the property (no params
	        crossValidate: [], // Any validation functions to be called, requested by other properties
	        modelValidate: [], // Any validation functions to be called, requested by overall model
	        validators: _validators, // Collection of validators attached to the property
	        validationOptions: validationOptions, // Collection of options on how/when validators are called
	        isArray: isArray, // Whether this property is an array
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
	        throw new Error('Reserved property name "' + def.key + '" used in property definition of ' + name);
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

	  var _iteratorNormalCompletion3 = true;
	  var _didIteratorError3 = false;
	  var _iteratorError3 = undefined;

	  try {
	    var _loop = function _loop() {
	      var key = _step3.value;


	      var def = model.def[key];

	      // Process isRequired convenience flag
	      if (def.validationOptions.includes(_Validation2.default.isRequired) && !def.validators.includes(_Validation2.default.required)) {
	        validators.shift(_Validation2.default.required);
	      }

	      if (def.validators.length > 0) {
	        (function () {
	          var validators = def.validators; // validator definitions
	          var isOptional = def.validationOptions.includes(_Validation2.default.isOptional);
	          var isOptionalShortCircuit = function isOptionalShortCircuit() {
	            return false;
	          }; // returns whether can skip the validators

	          // setup the validator validate
	          var _iteratorNormalCompletion7 = true;
	          var _didIteratorError7 = false;
	          var _iteratorError7 = undefined;

	          try {
	            var _loop2 = function _loop2() {
	              var validatorDef = _step7.value;

	              var crossValidation = validatorDef.crossValidation;
	              var funcArgs = [key].concat((0, _toConsumableArray3.default)(crossValidation));

	              // Create the validate function for the specific validator
	              var validate = function validate() {
	                var _this5 = this,
	                    _validatorDef$validat;

	                var args = funcArgs.map(function (key) {
	                  return _this5.__data[key];
	                });
	                return (_validatorDef$validat = validatorDef.validator.validate).call.apply(_validatorDef$validat, [this].concat((0, _toConsumableArray3.default)(args)));
	              };

	              validatorDef.validate = validate;
	              validatorDef.message = validatorDef.validator.message;
	            };

	            for (var _iterator7 = (0, _getIterator3.default)(validators), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	              _loop2();
	            }
	            // end of validator validate set up

	            // setup optional validator
	          } catch (err) {
	            _didIteratorError7 = true;
	            _iteratorError7 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                _iterator7.return();
	              }
	            } finally {
	              if (_didIteratorError7) {
	                throw _iteratorError7;
	              }
	            }
	          }

	          if (isOptional) {
	            isOptionalShortCircuit = function isOptionalShortCircuit() {
	              var arg = this.__data[key];
	              return _Validation2.default.empty.validate.call(this, arg);
	            };
	          }
	          // end optional setup

	          // set up overall property validate function
	          var propValidate = function propValidate() {
	            var state = true;
	            var message = '';

	            if (!isOptionalShortCircuit.call(this)) {
	              var _iteratorNormalCompletion8 = true;
	              var _didIteratorError8 = false;
	              var _iteratorError8 = undefined;

	              try {
	                for (var _iterator8 = (0, _getIterator3.default)(validators), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                  var validatorDef = _step8.value;

	                  if (!validatorDef.validate.call(this)) {
	                    // if any validation fails, auto fail
	                    // Set the property error message to the failed validator error message
	                    state = false;
	                    message = validatorDef.message;
	                    break;
	                  }
	                }
	              } catch (err) {
	                _didIteratorError8 = true;
	                _iteratorError8 = err;
	              } finally {
	                try {
	                  if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                    _iterator8.return();
	                  }
	                } finally {
	                  if (_didIteratorError8) {
	                    throw _iteratorError8;
	                  }
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
	          var _iteratorNormalCompletion9 = true;
	          var _didIteratorError9 = false;
	          var _iteratorError9 = undefined;

	          try {
	            for (var _iterator9 = (0, _getIterator3.default)(validators), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	              var validator = _step9.value;

	              var crossValidation = validator.crossValidation;
	              var _iteratorNormalCompletion10 = true;
	              var _didIteratorError10 = false;
	              var _iteratorError10 = undefined;

	              try {
	                for (var _iterator10 = (0, _getIterator3.default)(crossValidation), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                  var crossKey = _step10.value;

	                  model.def[crossKey].crossValidate.push({
	                    key: key,
	                    validate: propValidate,
	                    validationOptions: def.validationOptions.includes(_Validation2.default.crossValidateImmediate) ? _Validation2.default.validateImmediate : []
	                  });
	                }
	              } catch (err) {
	                _didIteratorError10 = true;
	                _iteratorError10 = err;
	              } finally {
	                try {
	                  if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                    _iterator10.return();
	                  }
	                } finally {
	                  if (_didIteratorError10) {
	                    throw _iteratorError10;
	                  }
	                }
	              }
	            }
	          } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                _iterator9.return();
	              }
	            } finally {
	              if (_didIteratorError9) {
	                throw _iteratorError9;
	              }
	            }
	          }
	        })();
	      }
	    };

	    for (var _iterator3 = (0, _getIterator3.default)(model.def.keys), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	      _loop();
	    }

	    // END Property validation function creation

	    // Attach the getters and setters to each property
	  } catch (err) {
	    _didIteratorError3 = true;
	    _iteratorError3 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion3 && _iterator3.return) {
	        _iterator3.return();
	      }
	    } finally {
	      if (_didIteratorError3) {
	        throw _iteratorError3;
	      }
	    }
	  }

	  var _iteratorNormalCompletion4 = true;
	  var _didIteratorError4 = false;
	  var _iteratorError4 = undefined;

	  try {
	    var _loop3 = function _loop3() {
	      var key = _step4.value;

	      var def = model.def[key];
	      var setter = _ModelTypes2.default.getTypeSetter(def.type, def.isArray);
	      setter = setter(def.key, def);

	      //TODO: this currently runs through entire array of validators all the time. Make it better.
	      var propSetter = function propSetter(val) {
	        var _this6 = this;

	        setter.call(this, val); // Set the value in the underlying data store

	        // run validation if requested
	        if (def.validationOptions && def.validationOptions.includes(_Validation2.default.validateImmediate)) {
	          def.validate.call(this);
	        }

	        if (def.crossValidate) {
	          // run crossValidation if requested
	          def.crossValidate.forEach(function (crossVal) {
	            if (crossVal && crossVal.validationOptions && crossVal.validationOptions.includes(_Validation2.default.validateImmediate)) {
	              crossVal.validate.call(_this6);
	            }
	          });
	        }

	        if (def.modelValidate) {
	          // run modelValidation if requested
	          def.modelValidate.forEach(function (modelVal) {
	            if (modelVal && modelVal.validationOptions && modelVal.validationOptions.includes(_Validation2.default.validateImmediate)) {
	              modelVal.validate.call(_this6);
	            }
	          });
	        }
	      };

	      (0, _defineProperty2.default)(model.prototype, def.key, {
	        get: function get() {
	          return this.__data[def.key];
	        },
	        set: propSetter,
	        configurable: true
	      });
	    };

	    for (var _iterator4 = (0, _getIterator3.default)(model.def.keys), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	      _loop3();
	    }

	    /**
	     * This section provides the public facing interface for accessing
	     * validation states and messages that are produced from validation functions.
	     * Each of _Validations and _Messages has properties defined depending on
	     * host Model definition. The class definitions are then frozen.
	     */
	  } catch (err) {
	    _didIteratorError4 = true;
	    _iteratorError4 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion4 && _iterator4.return) {
	        _iterator4.return();
	      }
	    } finally {
	      if (_didIteratorError4) {
	        throw _iteratorError4;
	      }
	    }
	  }

	  model.prototype._Validations.keys = [];
	  model.prototype._Messages.keys = [];

	  // Attach the messages access point to validations for easier access
	  Object.defineProperty(model.prototype._Validations.prototype, 'messages', {
	    get: function get() {
	      return this.__modelInstance.messages;
	    },
	    configurable: false,
	    writeable: false,
	    enumerable: false
	  });

	  var _iteratorNormalCompletion5 = true;
	  var _didIteratorError5 = false;
	  var _iteratorError5 = undefined;

	  try {
	    var _loop4 = function _loop4() {
	      var key = _step5.value;

	      // if the property has no validators attached to it, it doesn't have a validation state
	      if (model.def[key].validators.length === 0) return 'continue';

	      // get the state of validation
	      (0, _defineProperty2.default)(model.prototype._Validations.prototype, key, {
	        get: function get() {
	          return this.__modelInstance.__validations[key];
	        },
	        configurable: false,
	        writeable: false,
	        enumerable: true
	      });

	      model.prototype._Validations.keys.push(key);

	      (0, _defineProperty2.default)(model.prototype._Messages.prototype, key, {
	        get: function get() {
	          return this.__modelInstance.__messages[key];
	        },
	        configurable: false,
	        writeable: false,
	        enumerable: true
	      });

	      model.prototype._Messages.keys.push(key);
	    };

	    for (var _iterator5 = (0, _getIterator3.default)(model.def.keys), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	      var _ret5 = _loop4();

	      if (_ret5 === 'continue') continue;
	    }

	    // The validations and messages classes should be immutable from this point forward
	  } catch (err) {
	    _didIteratorError5 = true;
	    _iteratorError5 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion5 && _iterator5.return) {
	        _iterator5.return();
	      }
	    } finally {
	      if (_didIteratorError5) {
	        throw _iteratorError5;
	      }
	    }
	  }

	  model.prototype._Validations.prototype = (0, _freeze2.default)(model.prototype._Validations.prototype);
	  model.prototype._Messages.prototype = (0, _freeze2.default)(model.prototype._Messages.prototype);

	  //Compose any instance methods that have been supplied for this model.
	  if (methods) {

	    if (!Array.isArray(methods)) methods = [methods];

	    //Compositions are allowed to override each other, but should not override built-in functions
	    methods.forEach(function (comp) {
	      var compMethods = (0, _getOwnPropertyNames2.default)(comp);
	      compMethods.forEach(function (compKey) {
	        if (RESERVED_WORDS.includes(compKey)) {
	          throw new Error('Reserved property name "' + compKey + '" used in instance methods definition of ' + name);
	        }
	      });
	    });

	    //Pull out the last inherited 'validate' function and store it, this is the model validator.
	    var _iteratorNormalCompletion6 = true;
	    var _didIteratorError6 = false;
	    var _iteratorError6 = undefined;

	    try {
	      for (var _iterator6 = (0, _getIterator3.default)(methods), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	        var methodComposition = _step6.value;

	        for (var key in methodComposition) {
	          if (key === 'validate') {
	            model.def.modelValidator = methodComposition[key];
	          }
	        }
	      }
	    } catch (err) {
	      _didIteratorError6 = true;
	      _iteratorError6 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion6 && _iterator6.return) {
	          _iterator6.return();
	        }
	      } finally {
	        if (_didIteratorError6) {
	          throw _iteratorError6;
	        }
	      }
	    }

	    (0, _compose2.default)(model.prototype, methods);
	  }

	  //Compose any static methods that have been supplied for this model.
	  if (statics) {

	    if (!Array.isArray(statics)) statics = [statics];

	    //Compositions are allowed to override each other, but should not override built-in functions
	    statics.forEach(function (comp) {
	      var compMethods = (0, _getOwnPropertyNames2.default)(comp);
	      compMethods.forEach(function (compKey) {
	        if (RESERVED_WORDS.includes(compKey)) {
	          throw new Error('Reserved property name "' + compKey + '" used in static methods definition of ' + name);
	        }
	      });
	    });

	    (0, _compose2.default)(model, statics);
	  }

	  return model;
	};

	exports.default = Model;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	var $Object = __webpack_require__(7).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(5);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(15), 'Object', {defineProperty: __webpack_require__(11).f});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , core      = __webpack_require__(7)
	  , ctx       = __webpack_require__(8)
	  , hide      = __webpack_require__(10)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 6 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(9);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(11)
	  , createDesc = __webpack_require__(19);
	module.exports = __webpack_require__(15) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(12)
	  , IE8_DOM_DEFINE = __webpack_require__(14)
	  , toPrimitive    = __webpack_require__(18)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(15) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(13);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(15) && !__webpack_require__(16)(function(){
	  return Object.defineProperty(__webpack_require__(17)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(16)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(13)
	  , document = __webpack_require__(6).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(13);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(21), __esModule: true };

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(22);
	module.exports = __webpack_require__(7).Object.freeze;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(13)
	  , meta     = __webpack_require__(23).onFreeze;

	__webpack_require__(26)('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
	  };
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(24)('meta')
	  , isObject = __webpack_require__(13)
	  , has      = __webpack_require__(25)
	  , setDesc  = __webpack_require__(11).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(16)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(5)
	  , core    = __webpack_require__(7)
	  , fails   = __webpack_require__(16);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(28), __esModule: true };

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(29);
	var $Object = __webpack_require__(7).Object;
	module.exports = function getOwnPropertyNames(it){
	  return $Object.getOwnPropertyNames(it);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(26)('getOwnPropertyNames', function(){
	  return __webpack_require__(30).f;
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(31)
	  , gOPN      = __webpack_require__(35).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(32)
	  , defined = __webpack_require__(34);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(33);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(36)
	  , hiddenKeys = __webpack_require__(43).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(25)
	  , toIObject    = __webpack_require__(31)
	  , arrayIndexOf = __webpack_require__(37)(false)
	  , IE_PROTO     = __webpack_require__(41)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(31)
	  , toLength  = __webpack_require__(38)
	  , toIndex   = __webpack_require__(40);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(39)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(39)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(42)('keys')
	  , uid    = __webpack_require__(24);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _from = __webpack_require__(45);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(46), __esModule: true };

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(47);
	__webpack_require__(62);
	module.exports = __webpack_require__(7).Array.from;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(48)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(49)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(39)
	  , defined   = __webpack_require__(34);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(50)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(51)
	  , hide           = __webpack_require__(10)
	  , has            = __webpack_require__(25)
	  , Iterators      = __webpack_require__(52)
	  , $iterCreate    = __webpack_require__(53)
	  , setToStringTag = __webpack_require__(58)
	  , getPrototypeOf = __webpack_require__(60)
	  , ITERATOR       = __webpack_require__(59)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10);

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(54)
	  , descriptor     = __webpack_require__(19)
	  , setToStringTag = __webpack_require__(58)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(10)(IteratorPrototype, __webpack_require__(59)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(12)
	  , dPs         = __webpack_require__(55)
	  , enumBugKeys = __webpack_require__(43)
	  , IE_PROTO    = __webpack_require__(41)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(17)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(57).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(11)
	  , anObject = __webpack_require__(12)
	  , getKeys  = __webpack_require__(56);

	module.exports = __webpack_require__(15) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(36)
	  , enumBugKeys = __webpack_require__(43);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6).document && document.documentElement;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(11).f
	  , has = __webpack_require__(25)
	  , TAG = __webpack_require__(59)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(42)('wks')
	  , uid        = __webpack_require__(24)
	  , Symbol     = __webpack_require__(6).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(25)
	  , toObject    = __webpack_require__(61)
	  , IE_PROTO    = __webpack_require__(41)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(34);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(8)
	  , $export        = __webpack_require__(5)
	  , toObject       = __webpack_require__(61)
	  , call           = __webpack_require__(63)
	  , isArrayIter    = __webpack_require__(64)
	  , toLength       = __webpack_require__(38)
	  , createProperty = __webpack_require__(65)
	  , getIterFn      = __webpack_require__(66);

	$export($export.S + $export.F * !__webpack_require__(68)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(12);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(52)
	  , ITERATOR   = __webpack_require__(59)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(11)
	  , createDesc      = __webpack_require__(19);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(67)
	  , ITERATOR  = __webpack_require__(59)('iterator')
	  , Iterators = __webpack_require__(52);
	module.exports = __webpack_require__(7).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(33)
	  , TAG = __webpack_require__(59)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(59)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	__webpack_require__(47);
	module.exports = __webpack_require__(75);

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(72);
	var global        = __webpack_require__(6)
	  , hide          = __webpack_require__(10)
	  , Iterators     = __webpack_require__(52)
	  , TO_STRING_TAG = __webpack_require__(59)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(73)
	  , step             = __webpack_require__(74)
	  , Iterators        = __webpack_require__(52)
	  , toIObject        = __webpack_require__(31);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(49)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(12)
	  , get      = __webpack_require__(66);
	module.exports = __webpack_require__(7).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(78);
	module.exports = __webpack_require__(7).setImmediate;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(5)
	  , $task   = __webpack_require__(79);
	$export($export.G + $export.B, {
	  setImmediate:   $task.set,
	  clearImmediate: $task.clear
	});

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(8)
	  , invoke             = __webpack_require__(80)
	  , html               = __webpack_require__(57)
	  , cel                = __webpack_require__(17)
	  , global             = __webpack_require__(6)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(33)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 80 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(83);
	module.exports = __webpack_require__(7).Object.keys;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(61)
	  , $keys    = __webpack_require__(56);

	__webpack_require__(26)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty = __webpack_require__(2);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	var _getOwnPropertyDescriptor = __webpack_require__(85);

	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

	var _getIterator2 = __webpack_require__(69);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	exports.default = compose;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Composes functions, getters, setters, properties to an object and binds them properly.
	 *
	 * @param obj the object to compose onto
	 * @param compositions an object containing all the functions, getters, setters, propertie to compose
	 * @returns {*}
	 */
	function compose(obj, compositions) {

	  if (!compositions) {
	    compositions = obj;
	    obj = {};
	  }

	  //Easier to assume an array of composition objects have been passed in
	  if (!Array.isArray(compositions)) {
	    compositions = [compositions];
	  }

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = (0, _getIterator3.default)(compositions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var composition = _step.value;


	      for (var key in composition) {
	        //Check to see if this property was inherited, if so it should not be composed.
	        //TODO: should this throw a warning? Devs may expect that it would compose inherited methods.
	        if (composition.hasOwnProperty(key)) {
	          var desc = (0, _getOwnPropertyDescriptor2.default)(composition, key);

	          //Check to see if the property descriptor actually defines a getter || setter.  These are composed slightly
	          //differently.
	          if (desc.get || desc.set) {
	            (0, _defineProperty2.default)(obj, key, {
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
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return obj;
	}

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(87);
	var $Object = __webpack_require__(7).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(31)
	  , $getOwnPropertyDescriptor = __webpack_require__(88).f;

	__webpack_require__(26)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(89)
	  , createDesc     = __webpack_require__(19)
	  , toIObject      = __webpack_require__(31)
	  , toPrimitive    = __webpack_require__(18)
	  , has            = __webpack_require__(25)
	  , IE8_DOM_DEFINE = __webpack_require__(14)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(15) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 89 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 90 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = immutableBinding;
	/**
	 * Returns an immutable object based on the data contained in a model.
	 *
	 * This uses structural sharing to make this efficient as possible.
	 *
	 * @returns {{}|*}
	 */
	function immutableBinding() {
	  if (!this.__rebuildBind) {
	    return this.__bind;
	  }

	  var bind = {
	    __start: Date.now(),
	    _type: this.constructor.model
	  };

	  for (var i = 0; i < this.constructor.def.keys.length; i++) {
	    var prop = this.constructor.def.keys[i];

	    //Nothings changed!  Re-use the last value.
	    if (!this.__propChanged[prop]) {
	      bind[prop] = this.__bind ? this.__bind[prop] : this.__data[prop];
	      continue;
	    }

	    var def = this.constructor.def[prop];
	    var val = this.__data[prop];

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
	          bind[prop] = val && val._array ? val._array.map.call(val, function (item) {
	            return item ? item.bind : null;
	          }) : null;
	        }

	        //An array of other things have changed.  Create a new array instance, but use the data in data.
	        else if (def.isArray) {
	            bind[prop] = [].concat(val && val._array ? val._array : val);
	          }

	          //It's a model.  Let it figure out whats changed by a recursive call.
	          else if (!def.isArray && def.type.isModel) {
	              bind[prop] = val.bind;
	            }

	            //Can we even get here?
	            else {
	                bind[prop] = val;
	                //TODO: log  a warning here since this seems to be an impossible code path.
	              }

	    this.__propChanged[prop] = false;
	  }

	  //Clear the changed flag
	  this.__rebuildBind = false;

	  //Store the last values for this instance.
	  if (this.constructor.historyEnabled && this.__bind && Date.now() - this.__bind.__start > this.constructor.historyInterval) {
	    //TODO: does it make sense to use an interval here?  The interval should be used on the notify on the model itself.
	    //TODO: I actually think this entire history functionality should be moved out of this immutable binding piece anyways.
	    this.__bind.__end = Date.now();
	    this.__history.push(this.__bind);
	  }

	  this.__bind = bind;

	  return this.__bind;
	}

/***/ },
/* 91 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = guid;
	var UIDCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	/**
	 * Generates a URL friendly, (probably) GUID (Globaly Unique ID) of given length.
	 *
	 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random why its "probably" unique.
	 *
	 * @param length
	 * @returns {string}
	 */
	function guid() {
	  var length = arguments.length <= 0 || arguments[0] === undefined ? 16 : arguments[0];

	  var str = '';

	  while (str.length < length) {
	    str += UIDCHARS[Math.random() * UIDCHARS.length | 0];
	  }

	  return str;
	}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(93);

	var _assign2 = _interopRequireDefault(_assign);

	exports.default = generateChangeSet;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	function generateChangeSet(defs, bind1, bind2) {
	  var objRefsSame = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	  var change = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
	  var path = arguments.length <= 5 || arguments[5] === undefined ? '' : arguments[5];

	  var _loop = function _loop(i) {
	    var key = defs.keys[i];
	    var def = defs[key];

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
	      return 'continue';
	    } else if (bind2[key] === undefined) {}
	    //no-op


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
	                var idKey = defs._id ? '_id' : '_mg';
	                var fullSetRequired = false;

	                if (bind1[key].length > bind2[key].length) {
	                  //If bind1 is a larger array than bind2 then
	                  // - iff all the ids in bind2 exist in bind1 in order, only removes have been made.
	                  // - else full set
	                  var potentialPull = [];

	                  var j = 0,
	                      k = 0,
	                      totalFound = 0;

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
	                    change.$pull['' + path + key + '.' + idKey] = { $in: potentialPull };
	                  }
	                } else if (bind1[key].length < bind2[key].length) {
	                  //else if bind1 is a smaller array then bind2
	                  // - if all ids in bind1 exist in bind2 in order, with no gaps, only simple adds have been made
	                  // - else full set

	                  var _j = 0,
	                      _k = 0,
	                      gaps = 0,
	                      _totalFound = 0,
	                      prevWasGap = false;

	                  var potentialAdd = {
	                    $each: [],
	                    $position: undefined
	                  };

	                  while (_j < bind1[key].length) {
	                    if (bind1[key][_j][idKey] !== bind2[key][_k][idKey]) {
	                      if (!prevWasGap) gaps++;
	                      prevWasGap = true;
	                      _k++;
	                      potentialAdd.$each.push(bind2[key][_k]);
	                      if (potentialAdd.$position === undefined) potentialAdd.$position = _j;
	                    } else {
	                      prevWasGap = false;
	                      _totalFound++;
	                      _j++;
	                      _k++;
	                    }
	                  }

	                  if (gaps > 1 || _totalFound !== bind1[key].length) {
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
	                    change.$push['' + path + key] = potentialAdd;
	                  }
	                } else {
	                  // - if all ids in bind1 exist in bind2, in order, sets by index have been made.
	                  // - else full set.
	                  var potentialSets = {};

	                  for (var _j2 = 0; _j2 < bind1[key].length; _j2++) {
	                    //First easiest check is too see if the object references are the same
	                    if (!(objRefsSame && bind1[key][_j2] === bind2[key][_j2])) {
	                      //Check to see if the keys are the same.
	                      if (bind1[key][_j2][idKey] !== bind2[key][_j2][idKey]) {
	                        fullSetRequired = true;
	                        break;
	                      } else {
	                        generateChangeSet(def.type.def, bind1[key][_j2], bind2[key][_j2], objRefsSame, potentialSets, '' + path + key + '.' + _j2 + '.');
	                      }
	                    }
	                  }

	                  //If we have made it this far, then we should merge these potential sets into the changeSet.
	                  (0, _assign2.default)(change, potentialSets);
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
	                  if (bind1[key].length !== bind2[key].length || bind1[key].some(function (item, index) {
	                    return bind2[key][index] !== item;
	                  })) {
	                    //Lazily create the $set object.
	                    if (!change.$set) change.$set = {};

	                    change.$set[path + key] = bind2[key];
	                  }
	                }
	              }

	              //It's a model.
	              else if (!def.array && def.type.isModel) {
	                  if (!(objRefsSame && bind1[key] === bind2[key])) {
	                    generateChangeSet(def.type.def, bind1[key], bind2[key], objRefsSame, change, '' + path + key + '.');
	                  }
	                } else {
	                  //Can we even get here?
	                  //TODO: check to see if this is what happens when a type is a function, at very least a warning should be thrown.
	                }
	  };

	  for (var i = 0; i < defs.keys.length; i++) {
	    var _ret = _loop(i);

	    if (_ret === 'continue') continue;
	  }

	  return change;
	}

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(94), __esModule: true };

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(95);
	module.exports = __webpack_require__(7).Object.assign;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(5);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(96)});

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(56)
	  , gOPS     = __webpack_require__(97)
	  , pIE      = __webpack_require__(89)
	  , toObject = __webpack_require__(61)
	  , IObject  = __webpack_require__(32)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(16)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 97 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 98 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = generateChangeSetV0;
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
	function generateChangeSetV0(defs, bind1, bind2) {

	  var change = {};

	  for (var i = 0; i < defs.keys.length; i++) {
	    var key = defs.keys[i];

	    /**
	     * Virtual properties are not persisted in the database.
	     */
	    if (defs[key].virtual) {
	      continue;
	    } else if (bind2[key] === undefined) {}
	    //no-op


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
	        } else if (bind1[key] !== bind2[key]) {
	          change[key] = {
	            cmd: 'set',
	            val: bind2[key]
	          };
	        }
	  }

	  return change;
	}

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _modelArray = __webpack_require__(100);

	var _modelArray2 = _interopRequireDefault(_modelArray);

	var _model = __webpack_require__(108);

	var _model2 = _interopRequireDefault(_model);

	var _dateArray = __webpack_require__(109);

	var _dateArray2 = _interopRequireDefault(_dateArray);

	var _date = __webpack_require__(110);

	var _date2 = _interopRequireDefault(_date);

	var _numberArray = __webpack_require__(111);

	var _numberArray2 = _interopRequireDefault(_numberArray);

	var _number = __webpack_require__(112);

	var _number2 = _interopRequireDefault(_number);

	var _booleanArray = __webpack_require__(113);

	var _booleanArray2 = _interopRequireDefault(_booleanArray);

	var _boolean = __webpack_require__(114);

	var _boolean2 = _interopRequireDefault(_boolean);

	var _stringArray = __webpack_require__(115);

	var _stringArray2 = _interopRequireDefault(_stringArray);

	var _string = __webpack_require__(116);

	var _string2 = _interopRequireDefault(_string);

	var _functionArray = __webpack_require__(117);

	var _functionArray2 = _interopRequireDefault(_functionArray);

	var _function = __webpack_require__(118);

	var _function2 = _interopRequireDefault(_function);

	var _generic = __webpack_require__(119);

	var _generic2 = _interopRequireDefault(_generic);

	var _ModelReference = __webpack_require__(120);

	var _ModelReference2 = _interopRequireDefault(_ModelReference);

	var _LocaleString = __webpack_require__(121);

	var _LocaleString2 = _interopRequireDefault(_LocaleString);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Custom Types 
	 */
	exports.default = {
	  /*
	  * BEFORE MAKING ANY CHANGES 
	  *   Analyze how the getTypes function works
	  * Each model type must be able to define
	  * a) Its own setter (setter)
	  * b) A check to see if a value is the type (check)
	  * 
	  * */
	  Model: {
	    setter: function setter(isArray) {
	      return isArray ? _modelArray2.default : _model2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val.isModel);
	    }
	  },
	  ModelReference: {
	    // ModelReferences will pass the Model check so this is redundant
	    setter: function setter(isArray) {
	      return isArray ? _functionArray2.default : _function2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val === _ModelReference2.default);
	    }
	  },
	  Date: {
	    setter: function setter(isArray) {
	      return isArray ? _dateArray2.default : _date2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val === Date);
	    }
	  },
	  Boolean: {
	    setter: function setter(isArray) {
	      return isArray ? _booleanArray2.default : _boolean2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val === Boolean);
	    }
	  },
	  String: {
	    setter: function setter(isArray) {
	      return isArray ? _stringArray2.default : _string2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val === String);
	    }
	  },
	  LocaleString: {
	    setter: function setter(isArray) {
	      return isArray ? _functionArray2.default : _function2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val === _LocaleString2.default);
	    }
	  },
	  Number: {
	    setter: function setter(isArray) {
	      return isArray ? _numberArray2.default : _number2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val === Number);
	    }
	  },
	  Object: {
	    setter: function setter(isArray) {
	      return _generic2.default;
	    },
	    check: function check(val) {
	      return Boolean(val) && Boolean(val === Object);
	    }
	  },
	  getTypes: function getTypes() {
	    // Compiles an array of all the ModelType set on this object
	    var types = [];

	    for (var type in this) {
	      // Go through each property in this object
	      // Only pull out fully defined model types
	      if (!this.hasOwnProperty(type)) {
	        continue;
	      }

	      var val = this[type];

	      if (val === Function) {
	        continue;
	      }

	      if (val.setter && val.check) {
	        types.push(val);
	      }
	    }

	    return types;
	  },
	  isValidType: function isValidType(val) {
	    // Check if a type is an allowed ModelType
	    return this.getTypes().some(function (type) {
	      return type.check(val);
	    });
	  },
	  getType: function getType(val) {
	    return this.getTypes().find(function (type) {
	      return type.check(val);
	    });
	  },
	  getTypeSetter: function getTypeSetter(val, isArray) {
	    // Get the setter for a specific type
	    if (this.isValidType(val)) {
	      return this.getType(val).setter(isArray);
	    } else {
	      console.warn('Generic setter used on model type. Check model definitions.');
	      return _generic2.default;
	    }
	  }
	}; /**
	    * Setters
	    */

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _ObservableArray = __webpack_require__(101);

	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    var _this = this;

	    //If we are overwriting an existing array, clear out any references the old models have to their parent
	    //to prevent memory leaks.
	    if (this.__data[key]) {
	      this.__data[key].forEach(function (obj) {
	        if (!obj) return;

	        obj.__parent = null;
	        obj.__parentKey = null;
	      });

	      this.__data[key].removeAllListeners();
	    }

	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    //Don't modify the original array.
	    var arr = new Array(val.length);

	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null) {
	        arr[i] = val[i].constructor !== def.type ? new def.type(val[i]) : val[i];
	        arr[i].__parent = this;
	        arr[i].__parentKey = key;
	      }
	    }

	    var next = _ObservableArray2.default.setup(this, key, arr);

	    //We need to listen for items added or removed to this array.  When they are added we need to set the parents,
	    //when removed we need to removed parents.
	    next.addListener(function (event) {
	      switch (event.type) {
	        case _ObservableArray2.default.EVENT_SET:
	        case _ObservableArray2.default.EVENT_ADD:
	          event.item.__parent = _this;
	          event.item.__parentKey = key;
	          break;
	        case _ObservableArray2.default.EVENT_REMOVE:
	          event.item.__parent = null;
	          event.item.__parentKey = null;
	          break;
	      }
	    });

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _iterator = __webpack_require__(102);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _defineProperty = __webpack_require__(2);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	var _classCallCheck2 = __webpack_require__(105);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(106);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _guid = __webpack_require__(91);

	var _guid2 = _interopRequireDefault(_guid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SORT = 'Sort';
	var ADD = 'Add';
	var REMOVE = 'Remove';
	var SET = 'Set';

	var ObservableArrayIterator = function () {
	  function ObservableArrayIterator(array) {
	    (0, _classCallCheck3.default)(this, ObservableArrayIterator);

	    this.i = 0;
	    this.array = array;
	  }

	  (0, _createClass3.default)(ObservableArrayIterator, [{
	    key: 'next',
	    value: function next() {
	      if (this.i >= this.array.length) {
	        this.i = 0;
	        return { done: true };
	      }

	      return { done: false, value: this.array[this.i++] };
	    }
	  }]);
	  return ObservableArrayIterator;
	}();

	var ObservableArray = function () {
	  function ObservableArray(items) {
	    (0, _classCallCheck3.default)(this, ObservableArray);

	    this.__listeners = [];

	    this._array = Array.isArray(items) ? items : new Array(items);

	    for (var i = 0; i < this._array.length; i++) {
	      this.defineIndexProperty(i);
	    }
	  }

	  (0, _createClass3.default)(ObservableArray, [{
	    key: 'defineIndexProperty',
	    value: function defineIndexProperty(index) {
	      if (!(index in this)) {
	        (0, _defineProperty2.default)(this, index, {
	          configurable: true,
	          enumerable: true,
	          get: function get() {
	            return this._array[index];
	          },
	          set: function set(val) {
	            this._array[index] = val;

	            this.raiseEvent({
	              array: this,
	              type: SET,
	              index: index,
	              item: val
	            });
	          }
	        });
	      }
	    }
	  }, {
	    key: _iterator2.default,


	    /**
	     * Iterator implementation.
	     * @returns {*}
	     */
	    value: function value() {
	      return new ObservableArrayIterator(this);
	    }
	  }, {
	    key: 'addListener',
	    value: function addListener(cb) {
	      var listener = {
	        id: (0, _guid2.default)(),
	        cb: cb
	      };

	      this.__listeners.push(listener);

	      return listener.id;
	    }
	  }, {
	    key: 'removeListener',
	    value: function removeListener(id) {
	      if (!id) return null;

	      var ix = this.__listeners.findIndex(function (listener) {
	        return listener.id === id;
	      });

	      return ix > -1 ? this.__listeners.splice(ix, 1) : null;
	    }
	  }, {
	    key: 'removeAllListeners',
	    value: function removeAllListeners() {
	      this.__listeners = [];
	    }
	  }, {
	    key: 'raiseEvent',
	    value: function raiseEvent(event) {
	      this.__listeners.forEach(function (listener) {
	        return listener.cb(event);
	      });
	    }
	  }, {
	    key: 'push',
	    value: function push(item) {
	      this._array.push(item);

	      this.defineIndexProperty(this.length - 1);

	      this.raiseEvent({
	        array: this,
	        type: ADD,
	        index: this.length - 1,
	        item: item
	      });
	    }
	  }, {
	    key: 'pop',
	    value: function pop() {
	      var item = this._array.pop();

	      delete this[this.length - 1];

	      this.raiseEvent({
	        array: this,
	        type: REMOVE,
	        index: this.length - 1,
	        item: item
	      });

	      return item;
	    }
	  }, {
	    key: 'unshift',
	    value: function unshift() {
	      var count = this._array.unshift.apply(this._array, arguments);

	      for (var i = 0; i < count; i++) {
	        this.defineIndexProperty(this.length + i);

	        this.raiseEvent({
	          array: this,
	          type: ADD,
	          index: i,
	          item: arguments[i + 1]
	        });
	      }

	      return count;
	    }
	  }, {
	    key: 'shift',
	    value: function shift() {
	      var item = this._array.shift();

	      delete this[this.length - 1];

	      this.raiseEvent({
	        array: this,
	        type: REMOVE,
	        index: 0,
	        item: item
	      });

	      return item;
	    }
	  }, {
	    key: 'splice',
	    value: function splice() {
	      // arguments[0] is the start index
	      // arguments[1] is the deleteCount
	      // arguments[n] for n>1 are items to splice
	      var startIndex = arguments[0];
	      var deleteCount = arguments[1];
	      var removed = this._array.splice.apply(this._array, arguments);

	      var lengthDelta = -removed.length;

	      for (var i = 0; i < removed.length; i++) {
	        this.raiseEvent({
	          array: this,
	          type: REMOVE,
	          index: startIndex + i,
	          item: removed[i]
	        });
	      }

	      // splice uses flat parameters to add, not an array
	      // need to grab all arguments for n>1
	      var toAdd = Array.prototype.slice.call(arguments, 2); // produces an array

	      if (toAdd) {

	        for (var _i = 0; _i < toAdd.length; _i++) {
	          this.raiseEvent({
	            array: this,
	            type: ADD,
	            index: startIndex + _i,
	            item: toAdd[_i]
	          });
	        }

	        lengthDelta += toAdd.length;
	      }

	      if (lengthDelta > 0) {
	        for (var _i2 = 0; _i2 < lengthDelta; _i2++) {
	          this.defineIndexProperty(this.length - 1 - _i2);
	        }
	      } else if (lengthDelta < 0) {
	        for (var _i3 = 0; _i3 < -lengthDelta; _i3++) {
	          delete this[this.length + _i3];
	        }
	      }

	      return removed;
	    }
	  }, {
	    key: 'sort',
	    value: function sort(fn) {
	      var _this = this;

	      var oldArray = this._array.slice();
	      this._array.sort(fn);

	      // only raise an event if something's happened
	      if (oldArray.some(function (val, index) {
	        return val !== _this._array[index];
	      })) {
	        this.raiseEvent({
	          array: this,
	          type: SORT
	        });
	      }

	      return this._array;
	    }
	  }, {
	    key: 'reverse',
	    value: function reverse() {
	      this._array.reverse();

	      this.raiseEvent({
	        array: this,
	        type: SORT
	      });

	      return this._array;
	    }
	  }, {
	    key: 'isArray',
	    value: function isArray(obj) {
	      return Array.isArray(obj);
	    }
	  }, {
	    key: 'join',
	    value: function join() {
	      return this._array.join.apply(this._array, arguments);
	    }
	  }, {
	    key: 'forEach',
	    value: function forEach(fn) {
	      return this._array.forEach(fn);
	    }
	  }, {
	    key: 'slice',
	    value: function slice() {
	      return this._array.slice.apply(this._array, arguments);
	    }
	  }, {
	    key: 'concat',
	    value: function concat() {
	      return this._array.concat.apply(this._array, arguments);
	    }
	  }, {
	    key: 'includes',
	    value: function includes(fn) {
	      return this._array.includes(fn);
	    }
	  }, {
	    key: 'reduce',
	    value: function reduce() {
	      return this._array.reduce.apply(this._array, arguments);
	    }
	  }, {
	    key: 'map',
	    value: function map(fn) {
	      return this._array.map(fn);
	    }
	  }, {
	    key: 'filter',
	    value: function filter(fn) {
	      return this._array.filter(fn);
	    }
	  }, {
	    key: 'find',
	    value: function find(fn) {
	      return this._array.find(fn);
	    }
	  }, {
	    key: 'some',
	    value: function some(fn) {
	      return this._array.some(fn);
	    }
	  }, {
	    key: 'indexOf',
	    value: function indexOf(val) {
	      return this._array.indexOf(val);
	    }
	  }, {
	    key: 'findIndex',
	    value: function findIndex(fn) {
	      return this._array.findIndex(fn);
	    }

	    /**
	     * Returns an new plain Array with the contents that were in this ObservableArray instance.
	     *
	     * @returns {array}
	     */

	  }, {
	    key: 'toArray',
	    value: function toArray() {
	      return [].concat(this._array);
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return this._array.length;
	    }
	  }], [{
	    key: 'setup',


	    /**
	     * TODO: This doesn't belong in the ObservableArray since its specific to Models.js, it should be moved to a helper
	     * function.
	     *
	     * @param obj
	     * @param key
	     * @param val
	     * @returns {*}
	     */
	    value: function setup(obj, key, val) {
	      if (!ObservableArray.isObservableArray(val)) {
	        val = new ObservableArray(val);
	      }

	      //Hookup the onChanged event
	      val.addListener(function (event) {
	        return obj.__onChanged(key, val, event);
	      });

	      return val;
	    }
	  }, {
	    key: 'isObservableArray',
	    value: function isObservableArray(obj) {
	      return !obj ? false : this === obj.constructor;
	    }
	  }, {
	    key: 'isArray',
	    value: function isArray(obj) {
	      return Array.isArray(obj);
	    }
	  }]);
	  return ObservableArray;
	}();

	ObservableArray.EVENT_SORT = SORT;
	ObservableArray.EVENT_ADD = ADD;
	ObservableArray.EVENT_REMOVE = REMOVE;
	ObservableArray.EVENT_SET = SET;
	exports.default = ObservableArray;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(47);
	__webpack_require__(71);
	module.exports = __webpack_require__(104).f('iterator');

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(59);

/***/ },
/* 105 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(2);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 107 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (obj, key, val) {
	  if (val === null || val === undefined) {
	    obj.__data[key] = val;
	    obj.__onChanged(key, val);
	    return true;
	  }

	  return false;
	};

	;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {

	    //Remove reference to __parent on the model being replaced to avoid memory leaks.
	    if (this.__data[key]) {
	      this.__data[key].__parent = null;
	      this.__data[key].__parentKey = null;
	    }

	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    //Check to make sure the value being set is the correct Model, if not, cast it.
	    var next = val.constructor === def.type ? val : new def.type(val);

	    next.__parent = this;
	    next.__parentKey = key;

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _ObservableArray = __webpack_require__(101);

	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== Date) val[i] = new Date(val[i]);
	    }

	    var next = _ObservableArray2.default.setup(this, key, val);

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    var next = val.constructor === Date ? val : new Date(val);

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _ObservableArray = __webpack_require__(101);

	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== Number) val[i] = parseFloat(val[i]);
	    }

	    val = _ObservableArray2.default.setup(this, key, val);

	    this.__data[key] = val;
	    this.__onChanged(key, val);
	  };
	}

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    var next = val.constructor === Number ? val : parseFloat(val);
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _ObservableArray = __webpack_require__(101);

	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null) val[i] = !!val[i];
	    }

	    var next = _ObservableArray2.default.setup(this, key, val);

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    var next = !!val;
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _ObservableArray = __webpack_require__(101);

	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== String) val[i] = val[i].toString();
	    }

	    var next = _ObservableArray2.default.setup(this, key, val);

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    var next = val.constructor === String ? val : val.toString();
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;

	var _ObservableArray = __webpack_require__(101);

	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);

	var _nullCheck = __webpack_require__(107);

	var _nullCheck2 = _interopRequireDefault(_nullCheck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setter(key, def) {
	  return function (val) {
	    var _this = this;

	    if ((0, _nullCheck2.default)(this, key, val)) return;

	    //Because this is an array of something with a function type, we do not know if the array entries
	    //are in the correct format.  So we will have to call the function again.
	    //It is assumed that any function will account for this.
	    var next = Array.prototype.map.call(val, function (item) {
	      return _this.constructor.def[key].type(item);
	    });

	    next = _ObservableArray2.default.setup(this, key, next);

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 118 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	function setter(key, def) {
	  return function (val) {
	    var next = this.constructor.def[key].type(val);

	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 119 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	function setter(key, def) {
	  return function (val) {
	    this.__data[key] = val;
	    this.__onChanged(key, val);
	  };
	}

/***/ },
/* 120 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = ModelReference;
	function ModelReference(val) {
	  if (!val) return val;

	  //This is already a string, just return it
	  if (val.constructor === String) return val;

	  return val._id;
	}

/***/ },
/* 121 */
/***/ function(module, exports) {

	"use strict";

	/** TODO: refactor out to support multiple locales. */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = LocaleString;
	var DEFAULT_LOCALE = 'en';

	function LocaleString(val) {
	  if (!val) return val;

	  //This is already a string, just return it
	  if (val.constructor === String) return val;

	  return val[DEFAULT_LOCALE];
	}

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _EmailValidator = __webpack_require__(123);

	var _EmailValidator2 = _interopRequireDefault(_EmailValidator);

	var _RegexValidator = __webpack_require__(125);

	var _RegexValidator2 = _interopRequireDefault(_RegexValidator);

	var _MaxLengthValidator = __webpack_require__(126);

	var _MaxLengthValidator2 = _interopRequireDefault(_MaxLengthValidator);

	var _MinLengthValidator = __webpack_require__(127);

	var _MinLengthValidator2 = _interopRequireDefault(_MinLengthValidator);

	var _MatchValidator = __webpack_require__(128);

	var _MatchValidator2 = _interopRequireDefault(_MatchValidator);

	var _required = __webpack_require__(129);

	var _required2 = _interopRequireDefault(_required);

	var _empty = __webpack_require__(130);

	var _empty2 = _interopRequireDefault(_empty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  // Validator types
	  // With inspiration from Django Form and Field Validators
	  // Validator types are NOT true classes, no need to use "new"
	  // Some validator types have been aliased for convenience
	  EmailValidator: _EmailValidator2.default,
	  RegexValidator: _RegexValidator2.default,
	  MaxLengthValidator: _MaxLengthValidator2.default,
	  MinLengthValidator: _MinLengthValidator2.default,
	  MatchValidator: _MatchValidator2.default,
	  equalTo: _MatchValidator2.default,
	  minLength: _MinLengthValidator2.default,
	  maxLength: _MaxLengthValidator2.default,
	  regex: _RegexValidator2.default,
	  email: (0, _EmailValidator2.default)(),
	  phoneNumber: (0, _RegexValidator2.default)(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/, '', "Please enter a valid phone number."),
	  required: _required2.default,
	  empty: _empty2.default,
	  // ValidatorOption Flags
	  isRequired: 'isRequired', // Convenience flag
	  isOptional: 'isOptional',
	  validateImmediate: 'validateImmediate',
	  crossValidateImmediate: 'crossValidateImmediate',

	  /**
	   * Determines if a validator is in the expected structure
	   * @param val Validator to check
	   * @returns {boolean} Whether validator is defined
	   */
	  isValidValidator: function isValidValidator(val) {
	    //TODO: Do we need to be more defensive than this?
	    return val && val.validate && val.message;
	  },
	  /**
	   * Gets a list of predefined Model validationOption's
	   * @returns {Array}
	   */
	  getValidationOptions: function getValidationOptions() {
	    var validationOptions = [];

	    for (var validationOption in this) {
	      if (!this.hasOwnProperty(validationOption)) continue;

	      var val = this[validationOption];

	      if (val === Function) {
	        continue;
	      }

	      if (val.constructor === String) {
	        validationOptions.push(val);
	      }
	    }
	    return validationOptions;
	  },
	  /**
	   * Determines if a validationOption is one of the defined options
	   * @param val Option to check
	   * @returns {boolean} Whether option is defined
	   */
	  isValidValidationOption: function isValidValidationOption(val) {
	    return this.getValidationOptions().some(function (option) {
	      return option === val;
	    });
	  }

	};

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var whitelist = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	  var message = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  message = message || 'Please enter a valid email address.';

	  if (whitelist && !Array.isArray(whitelist)) whitelist = [whitelist];

	  var regex = '';

	  if (whitelist) {
	    var domainString = whitelist.map(_escapeRegExp2.default).join('|');
	    regex = new RegExp("^\\S+@(" + domainString + ")$");
	  } else {
	    regex = /^\S+@((?=[^.])[\S]+\.)*(?=[^.])[\S]+\.(?=[^.])[\S]+$/;
	  }

	  return {
	    validate: function validate(value) {
	      return value && regex.test(value);
	    },
	    message: message
	  };
	};

	var _escapeRegExp = __webpack_require__(124);

	var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	;

	/**
	 * Creates a validator object for emails
	 * @param {(string|string[])} [whitelist=null] Domain or domains to whitelist as valid, fails if any other domain is used
	 * @param {string} [message='Please enter a valid email address.'] Message to be displayed when validation fails
	 * @returns {{validate: function, message: string}}
	 */

/***/ },
/* 124 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = escapeRegExp;
	function escapeRegExp(string) {
	  // escapes special characters for regex consumption
	  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
	}

/***/ },
/* 125 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * A regex validator object that encapsulates a validation function and a message to be displayed on validation failure
	 *  If you have a very specific use case, with a static regex pattern, consider creating your own validator type
	 *  to take advantage of the gains by using regex literals
	 * @param {string} [pattern=null] Regex pattern to test
	 * @param {string} [flags=''] Flags to apply to regex test pattern,
	 * @param {string} [message='Value does not match expected pattern'] Message associated with failure of validation
	 * @returns {{validate: validate, message: string}}
	 */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var pattern = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	  var flags = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	  var message = arguments.length <= 2 || arguments[2] === undefined ? 'Value does not match expected pattern' : arguments[2];


	  var regex = pattern.constructor !== RegExp ? new RegExp(pattern, flags) : pattern;

	  return {
	    validate: function validate(value) {
	      return value && regex.test(value);
	    },
	    message: message
	  };
	};

	;

/***/ },
/* 126 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (maxLength) {
	  var message = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  if (typeof maxLength !== 'number') {
	    throw new Error('maxLength must be provided and must be a number');
	  }

	  message = message || 'Value length can be at most ' + maxLength;

	  return {
	    validate: function validate(value) {
	      return value && value.length <= maxLength;
	    },
	    message: message
	  };
	};

	;

/***/ },
/* 127 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (minLength) {
	  var message = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  if (typeof minLength !== 'number') {
	    throw new Error('minLength must be provided and must be a number');
	  }

	  message = message || 'Value length must be at least ' + minLength;

	  return {
	    validate: function validate(value) {
	      return value && value.length >= minLength;
	    },
	    message: message
	  };
	};

	;

/***/ },
/* 128 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var message = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


	  message = message || 'Values do not match';

	  return {
	    validate: function validate(value, comparisonValue) {
	      return value && comparisonValue && value === comparisonValue;
	    },
	    message: message
	  };
	};

	;

/***/ },
/* 129 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  validate: function validate(value) {
	    return Boolean(value);
	  },
	  message: 'This field is required.'
	};

/***/ },
/* 130 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  validate: function validate(value) {
	    return !Boolean(value);
	  },
	  message: 'This field must be empty.'
	};

/***/ }
/******/ ]);