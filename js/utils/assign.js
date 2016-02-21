import deepAssign from 'deep-assign'

//const assign = Object.assign || require('object.assign'); // Polyfill maybe needed for browser support

const assignToEmpty = (oldObject, newObject) => {
    return deepAssign({}, oldObject, newObject);
};

//const assignToEmpty = (oldObject, newObject) => {
//  return assign({}, oldObject, newObject);
//};

export default assignToEmpty;
