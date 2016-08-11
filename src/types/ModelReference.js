"use strict";

export default function ModelReference(val) {
  if (!val) return val;

  //This is already a string, just return it
  if (val.constructor === String) return val;

  return val._id;
}