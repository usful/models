export default function (obj, key, val, def) {
  if (val === null || val === undefined) {

    //Check to see if this def specifies an auto value.
    obj.__data[key] = (def.auto !== undefined) ? def.auto : val;
    obj.__onChanged(key, val);
    return true;
  }

  return false;
};