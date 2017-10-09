module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
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
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var fbemitter = {
  EventEmitter: __webpack_require__(7),
  EmitterSubscription : __webpack_require__(2)
};

module.exports = fbemitter;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * @providesModule EmitterSubscription
 * @typechecks
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventSubscription = __webpack_require__(8);

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */



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

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (model) {
  model.prototype._initEmitter = function () {
    if (!this._emitter) {
      this._emitter = new EventEmitter();
    }
  };

  model.prototype.listeners = function () {
    this._initEmitter();
    return this._emitter.listeners.apply(this._emitter, arguments);
  };

  model.prototype.emit = function () {
    if (!this._emitter) {
      return;
    }

    return this._emitter.emit.apply(this._emitter, arguments);
  };

  model.prototype.once = function () {
    this._initEmitter();
    return this._emitter.once.apply(this._emitter, arguments);
  };

  model.prototype.removeAllListeners = function () {
    if (!this._emitter) {
      return;
    }

    return this._emitter.removeAllListeners.apply(this._emitter, arguments);
  };

  model.prototype.addListener = function () {
    this._initEmitter();
    return this._emitter.addListener.apply(this._emitter, arguments);
  };
};

var _fbemitter = __webpack_require__(1);

var _fbemitter2 = _interopRequireDefault(_fbemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEmitter = _fbemitter2.default.EventEmitter;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _TypedArray = __webpack_require__(6);

var _TypedArray2 = _interopRequireDefault(_TypedArray);

var _middleware = __webpack_require__(11);

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Models(_ref) {
  var _ref$middleware = _ref.middleware,
      middleware = _ref$middleware === undefined ? [] : _ref$middleware,
      _ref$changeThrottle = _ref.changeThrottle,
      changeThrottle = _ref$changeThrottle === undefined ? 1 : _ref$changeThrottle;

  var definitions = {};

  function createModel(properties) {
    function model(data) {
      var _this = this;

      if (this.constructor !== model) {
        throw new Error('Must be invoked with new.');
      }

      this.__data = {};
      this.__json = {};
      this.__dirty = false;
      this.__parent = null;
      this.__parentKey = null;

      if (data) {
        Object.keys(data).forEach(function (key) {
          if (data.hasOwnProperty(key)) {
            _this[key] = data[key];
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
    model.def = _extends({}, properties, {
      props: []
    });

    //Process all the properties sent in.

    var _loop = function _loop(key) {
      if (!properties.hasOwnProperty(key)) {
        return 'continue';
      }

      //Functions can also be passed in.
      if (typeof properties[key] === 'function') {
        model.prototype[key] = properties[key];
        return 'continue';
      }

      //Props can be passed in as a simple definition or a complex one.
      //Simple
      //  name: String
      //
      //Complex
      //  name: {
      //    type: String,
      //    validators: ..
      //  }

      var prop = properties[key].constructor === Object && properties[key].type ? _extends({
        key: key
      }, properties[key]) : {
        key: key,
        type: properties[key]
      };

      //Unpack array types. ie. names: [String]
      if (Array.isArray(prop.type)) {
        prop.type = prop.type[0];
        prop.isArray = true;
      }

      //Setup the getters and setter for this guy.
      Object.defineProperty(model.prototype, prop.key, {
        get: function get() {
          return this.__data[prop.key];
        },
        set: function set(val) {
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
                val = new _TypedArray2.default(val, prop.type);
              } else if (prop.isArray && val.isTypedArray) {
                //Clone it, because this is coming from another object?
                val = new _TypedArray2.default(val.toJSON(), prop.type);
              } else if (prop.type.isModel && val.constructor !== prop.type) {
                //This value is a model, but it has not been created as a model yet.
                val = new prop.type(val);
              } else if (prop.type.isModel && val.constructor === prop.type.model) {
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
    };

    for (var key in properties) {
      var _ret = _loop(key);

      if (_ret === 'continue') continue;
    }

    model.prototype.__changed = function (key) {
      if (this.__parent) {
        this.__parent.__changed(this.__parentKey);
      }
    };

    model.isModel = true;

    return model;
  }

  return new (function () {
    function Models() {
      _classCallCheck(this, Models);
    }

    _createClass(Models, [{
      key: 'create',
      value: function create(name, properties) {
        var model = createModel(properties);

        //Call all the middle wares for this model in order.
        middleware.forEach(function (fn) {
          return fn(model);
        });

        model.model = name;
        model.middleware = middleware;
        definitions[name] = model;

        //TODO: probably a better way to do this than iterate over all after each model is added.
        //Attached references by name (string passed in as prop type).

        var _loop2 = function _loop2(modelName) {
          var modelDefinition = definitions[modelName];

          modelDefinition.def.props.filter(function (prop) {
            return typeof prop.type === 'string';
          }).forEach(function (prop) {
            if (definitions[prop.type]) {
              console.log('Fixing', modelName, prop.key, prop.type);
              prop.type = definitions[prop.type];
            }
          });
        };

        for (var modelName in definitions) {
          _loop2(modelName);
        }

        return model;
      }
    }, {
      key: 'addMiddleware',
      value: function addMiddleware(middleware) {
        for (var definition in definitions) {
          middleware(definitions[definition]);
        }
      }
    }, {
      key: 'definitions',
      get: function get() {
        return definitions;
      }
    }, {
      key: 'middleware',
      get: function get() {
        return middleware;
      }
    }, {
      key: 'Middleware',
      get: function get() {
        return _middleware2.default;
      }
    }, {
      key: 'changeThrottle',
      get: function get() {
        return changeThrottle;
      }
    }]);

    return Models;
  }())();
}

Models.middleware = _middleware2.default;
Models.TypedArray = _TypedArray2.default;

exports.default = Models;

/**
const Template = new Models.Document('Template', {name: String});
const template = new Template({name: 'Test'});

template.validate();
template.addListener('changed', (data) => console.log(data));
*/

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fbemitter = __webpack_require__(1);

var _fbemitter2 = _interopRequireDefault(_fbemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = _fbemitter2.default.EventEmitter;


var ARRAY_FUNCTIONS = ['sort', 'filter', 'join', 'reverse', 'slice', 'concat'];

var FUNCTIONS = ['forEach', 'includes', 'reduce', 'map', 'find', 'findIndex', 'some', 'indexOf'];

var TypedArrayIterator = function () {
  _createClass(TypedArrayIterator, null, [{
    key: 'isTypedArray',
    value: function isTypedArray(obj) {
      return !obj ? false : this === obj.constructor;
    }
  }, {
    key: 'isArray',
    value: function isArray(obj) {
      return Array.isArray(obj);
    }
  }]);

  function TypedArrayIterator(array) {
    _classCallCheck(this, TypedArrayIterator);

    this.i = 0;
    this.array = array;
  }

  _createClass(TypedArrayIterator, [{
    key: 'next',
    value: function next() {
      if (this.i >= this.array.length) {
        this.i = 0;
        return { done: true };
      }

      return { done: false, value: this.array[this.i++] };
    }
  }]);

  return TypedArrayIterator;
}();

var TypedArray = function () {
  function TypedArray(items, type) {
    var _this = this;

    _classCallCheck(this, TypedArray);

    this.__array = Array.isArray(items) ? [].concat(items) : [items];
    this.__parent = null;
    this.__parentKey = null;
    this.type = type;

    for (var i = 0; i < this.__array.length; i++) {
      this.defineIndexProperty(i);
    }

    //Cast any children.
    if (this.isModel) {
      this.__array = this.__array.map(function (item) {
        return !item || item.constructor === _this.type ? item : new _this.type(item);
      });
    }

    //Set any initial children.
    this.setParents();

    this.__json = this._toJSON();
  }

  _createClass(TypedArray, [{
    key: 'defineIndexProperty',
    value: function defineIndexProperty(index) {
      if (!(index in this)) {
        Object.defineProperty(this, index, {
          configurable: true,
          enumerable: true,
          get: function get() {
            return this.__array[index];
          },
          set: function set(val) {
            if (this.type.isModel) {
              //Clear out references for garbage collection
              if (this.__array[index]) {
                this.__array[index].__parent = null;
                this.__array[index].__parentKey = null;
              }

              if (val) {
                val.__parent = this;
                val.__parentKey = index;
              }
            }

            this.__array[index] = val;
            this.__changed(index);
          }
        });
      }
    }
  }, {
    key: 'setParents',
    value: function setParents() {
      if (this.isModel) {
        for (var i = 0; i < this.__array.length; i++) {
          if (this.__array[i]) {
            this.__array[i].__parent = this;
            this.__array[i].__parentKey = i;
          }
        }
      }
    }
  }, {
    key: 'clearParents',
    value: function clearParents() {
      if (this.isModel) {
        for (var i = 0; i < this.__array.length; i++) {
          if (this.__array[i]) {
            this.__array[i].__parent = null;
            this.__array[i].__parentKey = null;
          }
        }
      }
    }
  }, {
    key: '__changed',
    value: function __changed(index) {
      this.__json = this._toJSON();

      this.emit('change', index);

      if (this.__parent) {
        this.__parent.__changed(this.__parentKey);
      }
    }

    /**
     * Iterator implementation.
     * @returns {*}
     */

  }, {
    key: Symbol.iterator,
    value: function value() {
      return new TypedArrayIterator(this);
    }
  }, {
    key: 'push',
    value: function push(item) {
      this.__array.push(item);
      this.defineIndexProperty(this.length - 1);
      this.setParents();
      this.__changed(this.length - 1);
    }
  }, {
    key: 'pop',
    value: function pop() {
      var item = this.__array.pop();

      if (this.isModel && item) {
        item.__parent = null;
        item.__parentKey = null;
      }

      this.setParents();
      this.__changed(this.length);
      return item;
    }
  }, {
    key: 'unshift',
    value: function unshift() {
      var count = this.__array.unshift.apply(this.__array, arguments);

      for (var i = 0; i < count; i++) {
        this.defineIndexProperty(this.length + i);
      }

      this.setParents();
      this.__changed(0);

      return count;
    }
  }, {
    key: 'shift',
    value: function shift() {
      var item = this.__array.shift();

      if (this.isModel && item) {
        item.__parent = null;
        item.__parentKey = null;
      }

      this.setParents();
      this.__changed(0);
      return item;
    }
  }, {
    key: 'splice',
    value: function splice() {
      var _this2 = this;

      // arguments[0] is the start index
      // arguments[1] is the deleteCount
      // arguments[n] for n>1 are items to splice
      var removed = this.__array.splice.apply(this.__array, arguments);

      removed.forEach(function (item) {
        if (_this2.isModel && item) {
          item.__parent = null;
          _this2.__parentKey = null;
        }
      });

      var lengthDelta = -removed.length;
      // splice uses flat parameters to add, not an array
      // need to grab all arguments for n>1
      var toAdd = Array.prototype.slice.call(arguments, 2); // produces an array

      if (toAdd) {
        lengthDelta += toAdd.length;
      }

      if (lengthDelta > 0) {
        for (var i = 0; i < lengthDelta; i++) {
          this.defineIndexProperty(this.length - 1 - i);
        }
      }

      this.setParents();

      this.__changed(this.length);
      return removed;
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      return this.__json;
    }
  }, {
    key: '_toJSON',
    value: function _toJSON() {
      if (this.isModel) {
        this.__json = this.__array.map(function (item) {
          return item ? item.toJSON() : item;
        });
        return this.__json;
      }

      this.__json = [].concat(this.__array);
      return this.__json;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.__json;
    }

    /**
     * Returns an new plain Array with the contents that were in this TypedArray instance.
     *
     * @returns {array}
     */

  }, {
    key: 'toArray',
    value: function toArray() {
      return [].concat(this.__array);
    }
  }, {
    key: '_initEmitter',
    value: function _initEmitter() {
      if (!this._emitter) {
        this._emitter = new EventEmitter();
      }
    }
  }, {
    key: 'listeners',
    value: function listeners() {
      this._initEmitter();
      return this._emitter.listeners.apply(this._emitter, arguments);
    }
  }, {
    key: 'emit',
    value: function emit() {
      if (!this._emitter) {
        return;
      }

      return this._emitter.emit.apply(this._emitter, arguments);
    }
  }, {
    key: 'once',
    value: function once() {
      this._initEmitter();
      return this._emitter.once.apply(this._emitter, arguments);
    }
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      if (!this._emitter) {
        return;
      }

      return this._emitter.removeAllListeners.apply(this._emitter, arguments);
    }
  }, {
    key: 'addListener',
    value: function addListener() {
      this._initEmitter();
      return this._emitter.addListener.apply(this._emitter, arguments);
    }
  }, {
    key: 'isModel',
    get: function get() {
      return this.type && this.type.isModel;
    }
  }, {
    key: 'length',
    get: function get() {
      return this.__array.length;
    }
  }, {
    key: 'isTypedArray',
    get: function get() {
      return true;
    }
  }]);

  return TypedArray;
}();

exports.default = TypedArray;


ARRAY_FUNCTIONS.forEach(function (f) {
  return TypedArray.prototype[f] = function () {
    return new TypedArray(this.__array[f].apply(this.__array, arguments), this.type);
  };
});

FUNCTIONS.forEach(function (f) {
  return TypedArray.prototype[f] = function () {
    return this.__array[f].apply(this.__array, arguments);
  };
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BaseEventEmitter
 * @typechecks
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EmitterSubscription = __webpack_require__(2);
var EventSubscriptionVendor = __webpack_require__(9);

var emptyFunction = __webpack_require__(10);
var invariant = __webpack_require__(3);

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventSubscription
 * @typechecks
 */



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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * @providesModule EventSubscriptionVendor
 * @typechecks
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = __webpack_require__(3);

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

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
var emptyFunction = function emptyFunction() {};

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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(4);

var _events2 = _interopRequireDefault(_events);

var _validation = __webpack_require__(12);

var _validation2 = _interopRequireDefault(_validation);

var _immutable = __webpack_require__(25);

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  events: _events2.default,
  validation: _validation2.default,
  immutable: _immutable2.default
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Validation = __webpack_require__(13);

var _Validation2 = _interopRequireDefault(_Validation);

var _ValidationError = __webpack_require__(24);

var _ValidationError2 = _interopRequireDefault(_ValidationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ValidationMiddleware(model) {
  model.prototype.validate = function () {
    var _this = this;

    var result = {};
    var props = this.constructor.def.props.filter(function (prop) {
      return prop.validators && prop.validators.length > 0;
    });

    var valid = true;

    props.forEach(function (prop) {
      //Required is a special validator, so we will check to see if its in the list.
      var isRequired = prop.validators.some(function (validator) {
        return validator === _Validation2.default.required;
      });

      var hasValue = _Validation2.default.required.validate.call(_this, _this.__data[prop.key]);

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

      prop.validators.forEach(function (validator) {
        if (validator === _Validation2.default.required) {
          return;
        }

        result[prop.key] = validator.call(_this, _this.__data[prop.key]);

        if (!result[prop.key]) {
          valid = false;
        }
      });
    });

    if (!valid) {
      throw new _ValidationError2.default(result);
    }

    return true;
  };
}

ValidationMiddleware.validators = _Validation2.default;
ValidationMiddleware.ValidationError = _ValidationError2.default;

exports.default = ValidationMiddleware;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RegexValidator = __webpack_require__(14);

var _RegexValidator2 = _interopRequireDefault(_RegexValidator);

var _MaxLengthValidator = __webpack_require__(15);

var _MaxLengthValidator2 = _interopRequireDefault(_MaxLengthValidator);

var _MinLengthValidator = __webpack_require__(16);

var _MinLengthValidator2 = _interopRequireDefault(_MinLengthValidator);

var _MatchValidator = __webpack_require__(17);

var _MatchValidator2 = _interopRequireDefault(_MatchValidator);

var _InValidator = __webpack_require__(18);

var _InValidator2 = _interopRequireDefault(_InValidator);

var _MaxValidator = __webpack_require__(19);

var _MaxValidator2 = _interopRequireDefault(_MaxValidator);

var _MinValidator = __webpack_require__(20);

var _MinValidator2 = _interopRequireDefault(_MinValidator);

var _integer = __webpack_require__(21);

var _integer2 = _interopRequireDefault(_integer);

var _required = __webpack_require__(22);

var _required2 = _interopRequireDefault(_required);

var _empty = __webpack_require__(23);

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

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

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

exports.default = function (pattern) {
  var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Value does not match expected pattern';


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

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (maxLength) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

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

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (minLength) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

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

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (field) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Values do not match';


  return {
    validate: function validate(value) {
      return this[field] === value;
    },
    message: message,
    name: 'MatchValidator'
  };
};

;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  validate: function validate(value) {
    return value !== null && value !== undefined;
  },
  message: 'This field is required.',
  name: 'required'
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function ValidationError(result) {
  this.name = 'ValidationError';
  this.message = 'Validation Failed';
  this.validation = result;
  this.stack = new Error().stack;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

exports.default = ValidationError;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (model) {
  model.prototype.valueOf = function () {
    return this.__json;
  };

  model.prototype.toJSON = function () {
    return this.__json;
  };

  model.prototype.__changed2 = model.prototype.__changed;

  model.prototype.__flush = function () {
    var data = _extends({}, this.__data);

    this.constructor.def.props.filter(function (prop) {
      return !prop.virtual && (prop.type.isModel || prop.isArray);
    }).forEach(function (prop) {
      return data[prop.key] = data[prop.key] ? data[prop.key].toJSON() : data[prop.key];
    });

    this.__json = data;
    this.__dirty = null;

    if (this.constructor.middleware.includes(_events2.default)) {
      this.emit('change', data);
    }
  };

  model.prototype.__changed = function (key) {
    var _this = this;

    console.log(this.constructor.model, '__changed', key);
    if (!this.__dirty) {
      this.__dirty = setTimeout(function () {
        return _this.__flush();
      }, this.constructor.changeThrottle);
    }

    if (this.constructor.middleware.includes(_events2.default)) {
      this.emit(key + 'Changed');
    }

    this.__changed2(key);
  };
};

var _events = __webpack_require__(4);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ })
/******/ ]);
//# sourceMappingURL=Models.js.map