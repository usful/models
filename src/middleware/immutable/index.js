import eventsMiddleware from '../events';

function immutableMiddleware(model) {
  model.prototype.valueOf = function() {
    return this.__json;
  };

  model.prototype.toJSON = function() {
    return this.__json;
  };

  model.prototype.__changed2 = model.prototype.__changed;

  model.prototype.__flush = function() {
    const data = {};

    this.constructor.def.props.filter(prop => !prop.virtual).forEach(prop => {
      const val = this.__data[prop.key];

      if (prop.type.isModel || prop.isArray) {
        if (val) {
          val.__flush();
          data[prop.key] = val.toJSON();
        } else {
          data[prop.key] = val;
        }
      } else if (prop.isTypeFunction && prop.type.toJSON) {
        data[prop.key] = prop.type.toJSON(val);
      } else {
        data[prop.key] = val;
      }
    });

    this.__json = data;
    this.__dirty = false;

    if (this.constructor.middleware.includes(eventsMiddleware)) {
      this.emit('change', data);
    }
  };

  model.prototype.__changed = function(key) {
    if (!this.__dirty) {
      this.__dirty = setImmediate(() => this.__flush());
    }

    if (this.constructor.middleware.includes(eventsMiddleware)) {
      this.emit(`${key}Changed`);
    }

    this.__changed2(key);
  };

  //Setup the getters and setter for this guy.
  Object.defineProperty(model.prototype, 'hasChanges', {
    get: function() {
      return !!this.__dirty;
    }
  });
}

immutableMiddleware.initialize = function(data) {
  this.__json = {};
  this.__dirty = false;
};

export default immutableMiddleware;
