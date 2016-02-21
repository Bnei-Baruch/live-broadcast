var deepAssign = require('deep-assign');

const assignToEmpty = (oldObject, newObject) => {
    return deepAssign({}, oldObject, newObject);
};

export default assignToEmpty;
