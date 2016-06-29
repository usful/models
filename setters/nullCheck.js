export default function (obj, key, val) {
  if (val === null || val === undefined) {
    obj.__changing(key, val);
    obj.__data[key] = val;
    return true;
  }

  return false;
};