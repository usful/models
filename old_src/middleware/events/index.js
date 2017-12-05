import FBEmitter from 'fbemitter';
const { EventEmitter } = FBEmitter;

export default function (model) {
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
}