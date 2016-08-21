(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Models", [], factory);
	else if(typeof exports === 'object')
		exports["Models"] = factory();
	else
		root["Models"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {"use strict";
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _fbemitter = __webpack_require__(3);
	
	var _compose = __webpack_require__(10);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	var _immutableBinding = __webpack_require__(11);
	
	var _immutableBinding2 = _interopRequireDefault(_immutableBinding);
	
	var _guid = __webpack_require__(12);
	
	var _guid2 = _interopRequireDefault(_guid);
	
	var _checkPropertyNames = __webpack_require__(13);
	
	var _checkPropertyNames2 = _interopRequireDefault(_checkPropertyNames);
	
	var _generateChangeSet = __webpack_require__(14);
	
	var _generateChangeSet2 = _interopRequireDefault(_generateChangeSet);
	
	var _ModelTypes = __webpack_require__(15);
	
	var _ModelTypes2 = _interopRequireDefault(_ModelTypes);
	
	var _Validation = __webpack_require__(31);
	
	var _Validation2 = _interopRequireDefault(_Validation);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Creates a new Model
	 * @constructor
	 */
	function Model() {
	  return Model.create.apply(this, arguments);
	}
	
	Model.Validation = _Validation2.default;
	
	Model.guid = _guid2.default;
	
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
	Model.create = function (name, properties, methods, statics) {
	  var model = function model(data) {
	    /**
	     * An event emitter.
	     */
	    this.__emitter = new _fbemitter.EventEmitter();
	
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
	    this.__rebuildBind = true;
	
	    /**
	     * The most recent copy of the data as an immutable object for binding.
	     * @type {{}}
	     * @private
	     */
	    this.__bind = null;
	
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
	
	    //Set any initial values.
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	      for (var _iterator = this.constructor.def.keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var key = _step.value;
	
	        if (this.constructor.def[key].initial) {
	          this[key] = this.constructor.def[key].initial;
	        }
	      }
	
	      //If data was passed when this instance was instantinated, hydrate that data into the model.
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
	
	    if (data) {
	      this.hydrate(data);
	    }
	
	    //Force the immutable bind object to come into existence and also store it for generating change sets.
	    this.__lastBindState = this.bind;
	
	    this.__constructing = false;
	
	    return this;
	  };
	
	  if (Object.keys(Model.models).includes(name)) {
	    throw new Error('Model ' + name + ' has already been defined');
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
	    return (0, _generateChangeSet2.default)(this.def, bind1, bind2, true);
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
	   * Triggered when a property has changed on this instance
	   *
	   * @param key The property that has changed
	   * @param val The new value
	   * @param [event] Any event details associated with the change
	   * @private
	   */
	  model.prototype.__onChanged = function (key, val, event) {
	    var def = this.constructor.def[key];
	
	    //Virtuals should not trigger the changed flag, as noted above, changed indicates changes that effect data have occurred.
	    if (!def.virtual) {
	      this.__changed = true;
	    }
	
	    //Sometimes the dev may set notify to false, this short circuits any change notification.
	    if (!def.notify) {
	      return;
	    }
	
	    this.__rebuildBind = true;
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
	
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	      for (var _iterator2 = this.constructor.def.keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var key = _step2.value;
	
	        if (this.__propShouldNotify[key]) {
	          this.emit(key + 'Changed', this);
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
	
	    this.__propShouldNotify = {};
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
	
	    var state = true;
	
	    var _iteratorNormalCompletion3 = true;
	    var _didIteratorError3 = false;
	    var _iteratorError3 = undefined;
	
	    try {
	      for (var _iterator3 = this.constructor.def.keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	        var key = _step3.value;
	
	        // if ANY return false it's false
	        state = state && this.constructor.def[key].validate.call(this);
	      }
	
	      //let modelState = this.constructor.def.modelValidator.call(this);
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
	  model.prototype.removeAllListeners = function () {
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
	      return this.__emitter.addListener(key ? key + 'Changed' : 'changed', cb);
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
	    return this.__emitter.once(key ? key + 'Changed' : 'changed', cb);
	  };
	
	  model.prototype.emit = function (event, data) {
	    return this.__emitter.emit(event, data);
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
	    var _this = this;
	
	    this.__rebuildBind = true;
	    this.__propChanged = {};
	    this.__propShouldNotify = {};
	    this.__history = [];
	    this.__bind = null;
	
	    this.constructor.def.keys.forEach(function (key) {
	      return _this[key] = _this.__lastBindState && !full ? _this.__lastBindState[key] : undefined;
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
	    var _this2 = this;
	
	    this.constructor.def.keys.forEach(function (key) {
	      return _this2[key] = undefined;
	    });
	    this.__changed = false;
	  };
	
	  /**
	   * Apply a subset of data to this instance of this model.
	   * @param props
	   */
	  model.prototype.patch = function (props) {
	    var _this3 = this;
	
	    this.constructor.def.keys.forEach(function (key) {
	      if (props[key] !== undefined) {
	        _this3[key] = props[key];
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
	
	  var RESERVED_WORDS = Object.getOwnPropertyNames(new model());
	  var STATIC_RESERVED_WORDS = Object.getOwnPropertyNames(model.prototype);
	
	  /**
	   * BOILERPLATE MODEL CODE IS ABOVE THIS POINT - MODEL SPECIFIC DEFINITIONS CODE IS BELOW THIS POINT
	   */
	  if (!Array.isArray(properties)) {
	    properties = [properties];
	  }
	
	  // parse property and check property definition
	  properties.forEach(function (props) {
	    var _loop = function _loop(key) {
	      //Dev can pass in either a simple type by passing in a primitive, Array, Model or a Function.
	      //Or they can pass in an Object with a more complex definition.
	      var type = props[key];
	      //Setup a blank validation function for each of use later.
	      var validate = function validate() {
	        return true;
	      };
	      //validators will be run in order
	      var validators = [];
	      var virtual = false;
	      var complexDef = {};
	      var notify = true;
	      var isRequired = false;
	      var auto = undefined;
	      var initial = undefined;
	
	      if (type.constructor === Object && type.type) {
	        complexDef = type;
	
	        // Unnest the inner type
	        type = complexDef.type;
	
	        //Setup validation function for this prop.
	        if (complexDef.validators) {
	          validators = Array.isArray(complexDef.validators) ? complexDef.validators : [complexDef.validators];
	
	          var ixIsRequired = validators.findIndex(function (validator) {
	            return validator === _Validation2.default.required;
	          });
	
	          //Required is a special validator.  Pull it out of the array and set a flag for use later.
	          if (ixIsRequired > -1) {
	            isRequired = true;
	            validators.splice(ixIsRequired, 1);
	          }
	
	          validate = function validate() {
	            var def = this.constructor.def[key];
	            var state = true;
	            var message = void 0;
	
	            var hasValue = _Validation2.default.required.validate.call(this, this.__data[key]);
	
	            if (def.isRequired && !hasValue) {
	              //If this is required and it is empty, validation fails.
	              state = false;
	              message = _Validation2.default.required.message;
	            } else if (!def.isRequired && !hasValue) {
	              //If this is NOT required, and has no value, then it is by default, valid.
	              state = true;
	            } else {
	              var _iteratorNormalCompletion4 = true;
	              var _didIteratorError4 = false;
	              var _iteratorError4 = undefined;
	
	              try {
	                for (var _iterator4 = def.validators[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                  var validator = _step4.value;
	
	                  if (!validator.validate.call(this, this.__data[key])) {
	                    state = false;
	                    message = validator.message;
	                    break;
	                  }
	                }
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
	      var isArray = Array.isArray(type);
	
	      if (isArray) {
	        type = type[0];
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
	
	      var def = _extends({}, complexDef, { // Let the dev setup their own properties
	        key: key, // The name of the property
	        type: type, // The type of the property
	        validate: validate, // The validation function of the property
	        validators: validators, // Collection of validators attached to the property
	        isArray: isArray, // Whether this property is an array
	        virtual: virtual, // Does this property persist to a data store? Or is it used for other purposes.
	        isRequired: isRequired, // is this property required.
	        notify: notify, // when this property is changed, should it trigger a notify
	        initial: initial, // what is the value this property should be initialized to?
	        auto: auto // what value will this take one after being set to null?
	
	      });
	
	      // def IS PROPERLY SET (all data is clean, functions have not been set up yet)
	
	      // Do a sanity check to make sure we don't duplicate keys
	      if (model.def.keys.includes(def.key)) {
	        throw new Error('Duplicate property name "' + def.key + '" defined in ' + name);
	      }
	
	      // Certain reserved properties that can't be used in model definitions
	      if (RESERVED_WORDS.includes(def.key)) {
	        throw new Error('Reserved property name "' + def.key + '" used in property definition of ' + name);
	      }
	
	      model.def[def.key] = def;
	      model.def.keys.push(def.key);
	
	      var setter = _ModelTypes2.default.getTypeSetter(def.type, def.isArray)(def.key, def);
	
	      Object.defineProperty(model.prototype, def.key, {
	        get: function get() {
	          return this.__data[def.key];
	        },
	        set: function set(val) {
	          setter.call(this, val);
	          def.validate.call(this);
	        },
	        configurable: true
	      });
	    };
	
	    for (var key in props) {
	      _loop(key);
	    }
	  });
	
	  //Compose any instance methods that have been supplied for this model.
	  if (methods) {
	    var _methods = Array.isArray(methods) ? methods : [methods];
	    (0, _checkPropertyNames2.default)(_methods, RESERVED_WORDS);
	    (0, _compose2.default)(model.prototype, _methods);
	  }
	
	  //Compose any static methods that have been supplied for this model.
	  if (statics) {
	    var _statics = Array.isArray(statics) ? statics : [statics];
	    (0, _checkPropertyNames2.default)(_statics, STATIC_RESERVED_WORDS);
	    (0, _compose2.default)(model, _statics);
	  }
	
	  return model;
	};
	
	module.exports = Model;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).setImmediate))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(2).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).setImmediate, __webpack_require__(1).clearImmediate))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	var fbemitter = {
	  EventEmitter: __webpack_require__(4)
	};
	
	module.exports = fbemitter;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule BaseEventEmitter
	 * @typechecks
	 */
	
	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var EmitterSubscription = __webpack_require__(5);
	var EventSubscriptionVendor = __webpack_require__(7);
	
	var emptyFunction = __webpack_require__(9);
	var invariant = __webpack_require__(8);
	
	/**
	 * @class BaseEventEmitter
	 * @description
	 * An EventEmitter is responsible for managing a set of listeners and publishing
	 * events to them when it is told that such events happened. In addition to the
	 * data for the given event it also sends a event control object which allows
	 * the listeners/handlers to prevent the default behavior of the given event.
	 *
	 * The emitter is designed to be generic enough to support all the different
	 * contexts in which one might want to emit events. It is a simple multicast
	 * mechanism on top of which extra functionality can be composed. For example, a
	 * more advanced emitter may use an EventHolder and EventFactory.
	 */
	
	var BaseEventEmitter = (function () {
	  /**
	   * @constructor
	   */
	
	  function BaseEventEmitter() {
	    _classCallCheck(this, BaseEventEmitter);
	
	    this._subscriber = new EventSubscriptionVendor();
	    this._currentSubscription = null;
	  }
	
	  /**
	   * Adds a listener to be invoked when events of the specified type are
	   * emitted. An optional calling context may be provided. The data arguments
	   * emitted will be passed to the listener function.
	   *
	   * TODO: Annotate the listener arg's type. This is tricky because listeners
	   *       can be invoked with varargs.
	   *
	   * @param {string} eventType - Name of the event to listen to
	   * @param {function} listener - Function to invoke when the specified event is
	   *   emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */
	
	  BaseEventEmitter.prototype.addListener = function addListener(eventType, listener, context) {
	    return this._subscriber.addSubscription(eventType, new EmitterSubscription(this._subscriber, listener, context));
	  };
	
	  /**
	   * Similar to addListener, except that the listener is removed after it is
	   * invoked once.
	   *
	   * @param {string} eventType - Name of the event to listen to
	   * @param {function} listener - Function to invoke only once when the
	   *   specified event is emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */
	
	  BaseEventEmitter.prototype.once = function once(eventType, listener, context) {
	    var emitter = this;
	    return this.addListener(eventType, function () {
	      emitter.removeCurrentListener();
	      listener.apply(context, arguments);
	    });
	  };
	
	  /**
	   * Removes all of the registered listeners, including those registered as
	   * listener maps.
	   *
	   * @param {?string} eventType - Optional name of the event whose registered
	   *   listeners to remove
	   */
	
	  BaseEventEmitter.prototype.removeAllListeners = function removeAllListeners(eventType) {
	    this._subscriber.removeAllSubscriptions(eventType);
	  };
	
	  /**
	   * Provides an API that can be called during an eventing cycle to remove the
	   * last listener that was invoked. This allows a developer to provide an event
	   * object that can remove the listener (or listener map) during the
	   * invocation.
	   *
	   * If it is called when not inside of an emitting cycle it will throw.
	   *
	   * @throws {Error} When called not during an eventing cycle
	   *
	   * @example
	   *   var subscription = emitter.addListenerMap({
	   *     someEvent: function(data, event) {
	   *       console.log(data);
	   *       emitter.removeCurrentListener();
	   *     }
	   *   });
	   *
	   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
	   *   emitter.emit('someEvent', 'def'); // does not log anything
	   */
	
	  BaseEventEmitter.prototype.removeCurrentListener = function removeCurrentListener() {
	    !!!this._currentSubscription ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Not in an emitting cycle; there is no current subscription') : invariant(false) : undefined;
	    this._subscriber.removeSubscription(this._currentSubscription);
	  };
	
	  /**
	   * Returns an array of listeners that are currently registered for the given
	   * event.
	   *
	   * @param {string} eventType - Name of the event to query
	   * @return {array}
	   */
	
	  BaseEventEmitter.prototype.listeners = function listeners(eventType) /* TODO: Array<EventSubscription> */{
	    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
	    return subscriptions ? subscriptions.filter(emptyFunction.thatReturnsTrue).map(function (subscription) {
	      return subscription.listener;
	    }) : [];
	  };
	
	  /**
	   * Emits an event of the given type with the given data. All handlers of that
	   * particular type will be notified.
	   *
	   * @param {string} eventType - Name of the event to emit
	   * @param {*} Arbitrary arguments to be passed to each registered listener
	   *
	   * @example
	   *   emitter.addListener('someEvent', function(message) {
	   *     console.log(message);
	   *   });
	   *
	   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
	   */
	
	  BaseEventEmitter.prototype.emit = function emit(eventType) {
	    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
	    if (subscriptions) {
	      var keys = Object.keys(subscriptions);
	      for (var ii = 0; ii < keys.length; ii++) {
	        var key = keys[ii];
	        var subscription = subscriptions[key];
	        // The subscription may have been removed during this event loop.
	        if (subscription) {
	          this._currentSubscription = subscription;
	          this.__emitToSubscription.apply(this, [subscription].concat(Array.prototype.slice.call(arguments)));
	        }
	      }
	      this._currentSubscription = null;
	    }
	  };
	
	  /**
	   * Provides a hook to override how the emitter emits an event to a specific
	   * subscription. This allows you to set up logging and error boundaries
	   * specific to your environment.
	   *
	   * @param {EmitterSubscription} subscription
	   * @param {string} eventType
	   * @param {*} Arbitrary arguments to be passed to each registered listener
	   */
	
	  BaseEventEmitter.prototype.__emitToSubscription = function __emitToSubscription(subscription, eventType) {
	    var args = Array.prototype.slice.call(arguments, 2);
	    subscription.listener.apply(subscription.context, args);
	  };
	
	  return BaseEventEmitter;
	})();
	
	module.exports = BaseEventEmitter;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 * 
	 * @providesModule EmitterSubscription
	 * @typechecks
	 */
	
	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var EventSubscription = __webpack_require__(6);
	
	/**
	 * EmitterSubscription represents a subscription with listener and context data.
	 */
	
	var EmitterSubscription = (function (_EventSubscription) {
	  _inherits(EmitterSubscription, _EventSubscription);
	
	  /**
	   * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
	   *   this subscription
	   * @param {function} listener - Function to invoke when the specified event is
	   *   emitted
	   * @param {*} context - Optional context object to use when invoking the
	   *   listener
	   */
	
	  function EmitterSubscription(subscriber, listener, context) {
	    _classCallCheck(this, EmitterSubscription);
	
	    _EventSubscription.call(this, subscriber);
	    this.listener = listener;
	    this.context = context;
	  }
	
	  return EmitterSubscription;
	})(EventSubscription);
	
	module.exports = EmitterSubscription;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule EventSubscription
	 * @typechecks
	 */
	
	'use strict';
	
	/**
	 * EventSubscription represents a subscription to a particular event. It can
	 * remove its own subscription.
	 */
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var EventSubscription = (function () {
	
	  /**
	   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
	   *   this subscription.
	   */
	
	  function EventSubscription(subscriber) {
	    _classCallCheck(this, EventSubscription);
	
	    this.subscriber = subscriber;
	  }
	
	  /**
	   * Removes this subscription from the subscriber that controls it.
	   */
	
	  EventSubscription.prototype.remove = function remove() {
	    if (this.subscriber) {
	      this.subscriber.removeSubscription(this);
	      this.subscriber = null;
	    }
	  };
	
	  return EventSubscription;
	})();
	
	module.exports = EventSubscription;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 * 
	 * @providesModule EventSubscriptionVendor
	 * @typechecks
	 */
	
	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var invariant = __webpack_require__(8);
	
	/**
	 * EventSubscriptionVendor stores a set of EventSubscriptions that are
	 * subscribed to a particular event type.
	 */
	
	var EventSubscriptionVendor = (function () {
	  function EventSubscriptionVendor() {
	    _classCallCheck(this, EventSubscriptionVendor);
	
	    this._subscriptionsForType = {};
	    this._currentSubscription = null;
	  }
	
	  /**
	   * Adds a subscription keyed by an event type.
	   *
	   * @param {string} eventType
	   * @param {EventSubscription} subscription
	   */
	
	  EventSubscriptionVendor.prototype.addSubscription = function addSubscription(eventType, subscription) {
	    !(subscription.subscriber === this) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'The subscriber of the subscription is incorrectly set.') : invariant(false) : undefined;
	    if (!this._subscriptionsForType[eventType]) {
	      this._subscriptionsForType[eventType] = [];
	    }
	    var key = this._subscriptionsForType[eventType].length;
	    this._subscriptionsForType[eventType].push(subscription);
	    subscription.eventType = eventType;
	    subscription.key = key;
	    return subscription;
	  };
	
	  /**
	   * Removes a bulk set of the subscriptions.
	   *
	   * @param {?string} eventType - Optional name of the event type whose
	   *   registered supscriptions to remove, if null remove all subscriptions.
	   */
	
	  EventSubscriptionVendor.prototype.removeAllSubscriptions = function removeAllSubscriptions(eventType) {
	    if (eventType === undefined) {
	      this._subscriptionsForType = {};
	    } else {
	      delete this._subscriptionsForType[eventType];
	    }
	  };
	
	  /**
	   * Removes a specific subscription. Instead of calling this function, call
	   * `subscription.remove()` directly.
	   *
	   * @param {object} subscription
	   */
	
	  EventSubscriptionVendor.prototype.removeSubscription = function removeSubscription(subscription) {
	    var eventType = subscription.eventType;
	    var key = subscription.key;
	
	    var subscriptionsForType = this._subscriptionsForType[eventType];
	    if (subscriptionsForType) {
	      delete subscriptionsForType[key];
	    }
	  };
	
	  /**
	   * Returns the array of subscriptions that are currently registered for the
	   * given event type.
	   *
	   * Note: This array can be potentially sparse as subscriptions are deleted
	   * from it when they are removed.
	   *
	   * TODO: This returns a nullable array. wat?
	   *
	   * @param {string} eventType
	   * @return {?array}
	   */
	
	  EventSubscriptionVendor.prototype.getSubscriptionsForType = function getSubscriptionsForType(eventType) {
	    return this._subscriptionsForType[eventType];
	  };
	
	  return EventSubscriptionVendor;
	})();
	
	module.exports = EventSubscriptionVendor;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	'use strict';
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	function invariant(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}
	
	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	"use strict";
	
	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}
	
	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}
	
	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};
	
	module.exports = emptyFunction;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compose;
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
	    for (var _iterator = compositions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var composition = _step.value;
	
	
	      for (var key in composition) {
	        //Check to see if this property was inherited, if so it should not be composed.
	        //TODO: should this throw a warning? Devs may expect that it would compose inherited methods.
	        if (composition.hasOwnProperty(key)) {
	          var desc = Object.getOwnPropertyDescriptor(composition, key);
	
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
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = checkPropertyNames;
	function checkPropertyNames(arr, reserved) {
	  arr.forEach(function (item) {
	    var propertyNames = Object.getOwnPropertyNames(item);
	
	    propertyNames.forEach(function (key) {
	      if (reserved.includes(key)) {
	        throw new Error('Reserved property name "' + key + '" used in instance methods definition of ' + item);
	      }
	    });
	  });
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = generateChangeSet;
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _modelArray = __webpack_require__(16);
	
	var _modelArray2 = _interopRequireDefault(_modelArray);
	
	var _model = __webpack_require__(19);
	
	var _model2 = _interopRequireDefault(_model);
	
	var _dateArray = __webpack_require__(20);
	
	var _dateArray2 = _interopRequireDefault(_dateArray);
	
	var _date = __webpack_require__(21);
	
	var _date2 = _interopRequireDefault(_date);
	
	var _numberArray = __webpack_require__(22);
	
	var _numberArray2 = _interopRequireDefault(_numberArray);
	
	var _number = __webpack_require__(23);
	
	var _number2 = _interopRequireDefault(_number);
	
	var _booleanArray = __webpack_require__(24);
	
	var _booleanArray2 = _interopRequireDefault(_booleanArray);
	
	var _boolean = __webpack_require__(25);
	
	var _boolean2 = _interopRequireDefault(_boolean);
	
	var _stringArray = __webpack_require__(26);
	
	var _stringArray2 = _interopRequireDefault(_stringArray);
	
	var _string = __webpack_require__(27);
	
	var _string2 = _interopRequireDefault(_string);
	
	var _functionArray = __webpack_require__(28);
	
	var _functionArray2 = _interopRequireDefault(_functionArray);
	
	var _function = __webpack_require__(29);
	
	var _function2 = _interopRequireDefault(_function);
	
	var _generic = __webpack_require__(30);
	
	var _generic2 = _interopRequireDefault(_generic);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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
	  Function: {
	    setter: function setter() {
	      return _generic2.default;
	    },
	    check: function check(val) {
	      return true;
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _ObservableArray = __webpack_require__(17);
	
	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);
	
	var _nullCheck = __webpack_require__(18);
	
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
	
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    //Don't modify the original array.
	    var arr = new Array(val.length);
	
	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null) {
	        arr[i] = val[i].constructor.isModel ? val[i] : new def.type(val[i]);
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _fbemitter = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SORT = 'Sort';
	var ADD = 'Add';
	var REMOVE = 'Remove';
	var SET = 'Set';
	
	var ObservableArrayIterator = function () {
	  function ObservableArrayIterator(array) {
	    _classCallCheck(this, ObservableArrayIterator);
	
	    this.i = 0;
	    this.array = array;
	  }
	
	  _createClass(ObservableArrayIterator, [{
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
	    _classCallCheck(this, ObservableArray);
	
	    this.__emitter = new _fbemitter.EventEmitter();
	
	    this._array = Array.isArray(items) ? items : new Array(items);
	
	    for (var i = 0; i < this._array.length; i++) {
	      this.defineIndexProperty(i);
	    }
	  }
	
	  _createClass(ObservableArray, [{
	    key: 'defineIndexProperty',
	    value: function defineIndexProperty(index) {
	      if (!(index in this)) {
	        Object.defineProperty(this, index, {
	          configurable: true,
	          enumerable: true,
	          get: function get() {
	            return this._array[index];
	          },
	          set: function set(val) {
	            this._array[index] = val;
	
	            this.emit({
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
	    key: Symbol.iterator,
	
	
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
	      return this.__emitter.addListener('changed', cb);
	    }
	  }, {
	    key: 'removeAllListeners',
	    value: function removeAllListeners() {
	      return this.__emitter.removeAllListeners();
	    }
	  }, {
	    key: 'emit',
	    value: function emit(event) {
	      this.__emitter.emit('changed', event);
	    }
	  }, {
	    key: 'push',
	    value: function push(item) {
	      this._array.push(item);
	
	      this.defineIndexProperty(this.length - 1);
	
	      this.emit({
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
	
	      this.emit({
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
	
	        this.emit({
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
	
	      this.emit({
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
	        this.emit({
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
	          this.emit({
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
	        this.emit({
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
	
	      this.emit({
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
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (obj, key, val, def) {
	  if (val === null || val === undefined) {
	
	    //Check to see if this def specifies an auto value.
	    obj.__data[key] = def.auto !== undefined ? def.auto : val;
	    obj.__onChanged(key, val);
	    return true;
	  }
	
	  return false;
	};
	
	;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	
	    //Remove reference to __parent on the model being replaced to avoid memory leaks.
	    if (this.__data[key]) {
	      this.__data[key].__parent = null;
	      this.__data[key].__parentKey = null;
	    }
	
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    //Check to make sure the value being set is the correct Model, if not, cast it.
	    var next = val.constructor.isModel ? val : new def.type(val);
	
	    next.__parent = this;
	    next.__parentKey = key;
	
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _ObservableArray = __webpack_require__(17);
	
	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== Date) val[i] = new Date(val[i]);
	    }
	
	    var next = _ObservableArray2.default.setup(this, key, val);
	
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    var next = val.constructor === Date ? val : new Date(val);
	
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _ObservableArray = __webpack_require__(17);
	
	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== Number) {
	
	        val[i] = parseFloat(val[i]);
	
	        //Check for NaN, isNaN is too slow
	        if (val[i] !== val[i]) {
	          val[i] = def.auto !== undefined ? def.auto : undefined;
	        }
	      }
	    }
	
	    val = _ObservableArray2.default.setup(this, key, val);
	
	    this.__data[key] = val;
	    this.__onChanged(key, val);
	  };
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    var next = val.constructor === Number ? val : parseFloat(val);
	
	    //Check for NaN, isNaN is too slow
	    if (next !== next) {
	      next = def.auto !== undefined ? def.auto : undefined;
	    }
	
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _ObservableArray = __webpack_require__(17);
	
	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null) val[i] = !!val[i];
	    }
	
	    var next = _ObservableArray2.default.setup(this, key, val);
	
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    var next = !!val;
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _ObservableArray = __webpack_require__(17);
	
	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    for (var i = 0; i < val.length; i++) {
	      if (val[i] !== undefined && val[i] !== null && val[i].constructor !== String) val[i] = val[i].toString();
	    }
	
	    var next = _ObservableArray2.default.setup(this, key, val);
	
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
	    var next = val.constructor === String ? val : val.toString();
	    this.__data[key] = next;
	    this.__onChanged(key, next);
	  };
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = setter;
	
	var _ObservableArray = __webpack_require__(17);
	
	var _ObservableArray2 = _interopRequireDefault(_ObservableArray);
	
	var _nullCheck = __webpack_require__(18);
	
	var _nullCheck2 = _interopRequireDefault(_nullCheck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setter(key, def) {
	  return function (val) {
	    var _this = this;
	
	    if ((0, _nullCheck2.default)(this, key, val, def)) return;
	
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
/* 29 */
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
/* 30 */
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _RegexValidator = __webpack_require__(32);
	
	var _RegexValidator2 = _interopRequireDefault(_RegexValidator);
	
	var _MaxLengthValidator = __webpack_require__(33);
	
	var _MaxLengthValidator2 = _interopRequireDefault(_MaxLengthValidator);
	
	var _MinLengthValidator = __webpack_require__(34);
	
	var _MinLengthValidator2 = _interopRequireDefault(_MinLengthValidator);
	
	var _MatchValidator = __webpack_require__(35);
	
	var _MatchValidator2 = _interopRequireDefault(_MatchValidator);
	
	var _InValidator = __webpack_require__(36);
	
	var _InValidator2 = _interopRequireDefault(_InValidator);
	
	var _MaxValidator = __webpack_require__(37);
	
	var _MaxValidator2 = _interopRequireDefault(_MaxValidator);
	
	var _MinValidator = __webpack_require__(38);
	
	var _MinValidator2 = _interopRequireDefault(_MinValidator);
	
	var _integer = __webpack_require__(39);
	
	var _integer2 = _interopRequireDefault(_integer);
	
	var _required = __webpack_require__(40);
	
	var _required2 = _interopRequireDefault(_required);
	
	var _empty = __webpack_require__(41);
	
	var _empty2 = _interopRequireDefault(_empty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  Regex: _RegexValidator2.default,
	  MaxLength: _MaxLengthValidator2.default,
	  MinLength: _MinLengthValidator2.default,
	  Match: _MatchValidator2.default,
	  In: _InValidator2.default,
	  Max: _MaxValidator2.default,
	  Min: _MinValidator2.default,
	  integer: _integer2.default,
	  required: _required2.default,
	  empty: _empty2.default
	};

/***/ },
/* 32 */
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
	    message: message,
	    name: 'RegexValidator'
	  };
	};
	
	;

/***/ },
/* 33 */
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
	    message: message,
	    name: 'MaxLengthValidator',
	    args: 'maxLength',
	    maxLength: maxLength
	  };
	};
	
	;

/***/ },
/* 34 */
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
	    message: message,
	    name: 'MinLengthValidator',
	    args: ['minLength'],
	    minLength: minLength
	  };
	};
	
	;

/***/ },
/* 35 */
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
	    message: message,
	    name: 'MatchValidator'
	  };
	};
	
	;

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = inValidator;
	function inValidator(values, message) {
	  if (!Array.isArray(values)) {
	    throw new Error('An array of values must be provided to the InValidator.');
	  }
	
	  message = message || 'Value must be one of ' + values.join(',');
	
	  return {
	    validate: function validate(value) {
	      return values.includes(value);
	    },
	    message: message,
	    name: 'InValidator',
	    args: ['values'],
	    values: values
	  };
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = MaxValidator;
	function MaxValidator(max, message) {
	  if (typeof max !== 'number') {
	    throw new Error('max must be provided and must be a number.');
	  }
	
	  message = message || 'Value must be max ' + max;
	
	  return {
	    validate: function validate(value) {
	      return value <= max;
	    },
	    message: message,
	    name: 'MaxValidator',
	    args: ['max'],
	    max: max
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = MinValidator;
	function MinValidator(min, message) {
	  if (typeof min !== 'number') {
	    throw new Error('min must be provided and must be a number.');
	  }
	
	  message = message || 'Value must be min ' + min;
	
	  return {
	    validate: function validate(value) {
	      return value >= min;
	    },
	    message: message,
	    name: MinValidator,
	    args: ['min'],
	    min: min
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  validate: function validate(n) {
	    return n === +n && n === (n | 0);
	  },
	  message: 'You have to enter a whole number value.',
	  name: 'integer'
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  validate: function validate(value) {
	    return Boolean(value);
	  },
	  message: 'This field is required.',
	  name: 'required'
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  validate: function validate(value) {
	    return !Boolean(value);
	  },
	  message: 'This field must be empty.',
	  name: 'empty'
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=Models.js.map