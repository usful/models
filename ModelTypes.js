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

/*
 * Custom Types 
 */
import ModelReference from './types/ModelReference';
import LocaleString from './types/LocaleString';

export default {
  /*
  * BEFORE MAKING ANY CHANGES 
  *   Analyze how the getTypes function works
  * Each model type must be able to define
  * a) Its own setter (setter)
  * b) A check to see if a value is the type (check)
  * 
  * */
  Model: {
    setter: function (isArray) {
      return isArray ? modelArraySetter : modelSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val.isModel);
    }
  },
  ModelReference: {
    // ModelReferences will pass the Model check so this is redundant
    setter: function (isArray) {
      return isArray ? functionArraySetter : functionSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val === ModelReference);
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
  LocaleString: {
    setter: function (isArray) {
      return isArray ? functionArraySetter : functionSetter;
    },
    check: function (val) {
      return Boolean(val) && Boolean(val === LocaleString);
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
  getTypes: function() {
    // Compiles an array of all the ModelType set on this object
    let types = [];
    for (let type in this) {
      // Go through each property in this object
      // Only pull out fully defined model types
      if (!this.hasOwnProperty(type))
        continue;

      let val = this[type];
      if (val === Function)
        continue;
      if (val.setter && val.check)
        types.push(val);
    }

    return types;
  },
  isValidType: function (val) {
    // Check if a type is an allowed ModelType
    return this.getTypes().some( type => type.check(val) );
  },
  getType: function (val) {
    return this.getTypes().find( type => type.check(val));
  },
  getTypeSetter: function (val, isArray) {
    // Get the setter for a specific type
    if (this.isValidType(val)) {
      let modelType = this.getType(val);
      if (modelType)
        return modelType.setter(isArray);
    }
    else {
      console.warn('Generic setter used on model type. Check model definitions.');
      return genericSetter;
    }
  }
}