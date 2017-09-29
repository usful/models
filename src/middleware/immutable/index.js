import eventsMiddleware from '../events';

export default function(model) {
  model.prototype.valueOf = function () {
    return this.__json;
  };

  model.prototype.toJSON = function () {
    return this.__json;
  };

  model.prototype.__changed2 = model.prototype.__changed;

  model.prototype.__changed = function (key) {
    if (!this.__dirty) {
      this.__dirty = setTimeout(() => {
        const data = {
          ...this.__data
        };

        this.constructor.def.props
          .filter(
            prop => !prop.virtual && (prop.type.isModel || prop.isArray)
          )
          .forEach(
            prop =>
              (data[prop.key] = this[prop.key]
                ? this[prop.key].toJSON()
                : this[prop.key])
          );

        this.__json = data;
        this.__dirty = null;

        if (this.constructor.middleware.includes(eventsMiddleware)) {
          this.emit('change', data);
        }
      }, this.constructor.changeThrottle);
    }

    if (this.constructor.middleware.includes(eventsMiddleware)) {
      this.emit(`${key}Changed`);
    }

    this.__changed2(key);
  };
}