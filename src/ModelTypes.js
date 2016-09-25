/**
 * Setters
 */
import modelArraySetter from './setters/modelArray';
import modelSetter from './setters/model';
import dateArraySetter from './setters/dateArray';
import dateSetter from './setters/date';
import numberArraySetter from './setters/numberArray';
import numberSetter from './setters/number';
import booleanArraySetter from './setters/booleanArray';
import booleanSetter from './setters/boolean';
import stringArraySetter from './setters/stringArray';
import stringSetter from './setters/string';
import functionArraySetter from './setters/functionArray';
import functionSetter from './setters/function';
import genericSetter from './setters/generic';

function isFunction(functionToCheck) {
  let getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export default {
  Model: {
    setter: function (isArray) {
      return isArray ? modelArraySetter : modelSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val.isModel);
    }
  },
  Date: {
    setter: function (isArray) {
      return isArray ? dateArraySetter : dateSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val === Date);
    }
  },
  Boolean: {
    setter: function (isArray) {
      return isArray ? booleanArraySetter : booleanSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val === Boolean);
    }
  },
  String: {
    setter: function (isArray) {
      return isArray ? stringArraySetter : stringSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val === String);
    }
  },
  Number: {
    setter: function (isArray) {
      return isArray ? numberArraySetter : numberSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val === Number);
    }
  },
  Object: {
    setter: function(isArray) {
      return genericSetter;
    },
    check: function(val) {
      return Boolean(val) && Boolean(val === Object);
    }
  },
  Function: {
    setter: function(isArray) {
      return isArray ? functionArraySetter : functionSetter;
    },
    check: function(val) {
      return Boolean(val) && isFunction(val);
    }
  },
  getTypeSetter: function (def) {
    if (this.Model.check(def.type)) return this.Model.setter(def.isArray);
    if (this.Date.check(def.type)) return this.Date.setter(def.isArray);
    if (this.Boolean.check(def.type)) return this.Boolean.setter(def.isArray);
    if (this.String.check(def.type)) return this.String.setter(def.isArray);
    if (this.Number.check(def.type)) return this.Number.setter(def.isArray);
    if (this.Function.check(def.type)) return this.Function.setter(def.isArray);
    if (this.Object.check(def.type)) return this.Object.setter(def.isArray);

    throw new Error(`Invalid type on  ${def.key}:${def.type}`);
  }
}