'use strict';

export default function checkPropertyNames(arr, reserved) {
  arr.forEach(item => {
    let propertyNames = Object.getOwnPropertyNames(item);

    propertyNames.forEach(key => {
      if (reserved.includes(key)) {
        throw new Error(`Reserved property name "${key}" used in instance methods definition of ${item}`)
      }
     })
  });
}