export default function (obj, key, val) {
  if (val === null || val === undefined) {
    obj.__data[key] = val;
    obj.__onChanged(key, val);
    return true;
  }

  return false;
};