import { v4 as uuidv4 } from "uuid";
const getPixelRatio = () => window.devicePixelRatio;
const fromCmToPx = (cm) => Math.round((cm * 96) / 2.54);
const fromCmToPt = (cm) => Math.round(cm * 28.346);
const fromPxToCm = (px) => Math.round((px * 2.54 * 100) / 96) / 100;
const fromPtToPx = (pt) => Math.round((4 * pt) / 3);
const fromPxToPt = (px) => (3 * px) / 4;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
//call method allows execute function with explicitly given this
const cloneObject = (obj, exclude = []) => {
  if (Object.prototype.toString.call(obj) == "[object Array]") {
    const result = [];
    obj.forEach((el) => {
      result.push(cloneObject(el, exclude));
    });
    return result;
  } else if (Object.prototype.toString.call(obj) == "[object Object]") {
    const result = {};
    Object.keys(obj).forEach((el) => {
      result[el] = exclude.includes(el) ? null : cloneObject(obj[el], exclude);
    });
    return result;
  } else {
    return obj;
  }
};

export {
  getPixelRatio,
  fromCmToPx,
  fromCmToPt,
  cloneObject,
  fromPxToCm,
  fromPtToPx,
  fromPxToPt,
  uuidv4,
  clamp
};
