const deepClone = (obj)=>{
    if(obj ==null && typeof obj !== 'object'){
        return obj;
    }
    if (Array.isArray(obj)) {
        const arrCopy = [];
        for (const item of obj) {
            arrCopy.push(deepClone(item));
        }
        return arrCopy;
    }

    const objCopy = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            objCopy[key] = deepClone(obj[key]);
        }
    }

    return objCopy;
}

module.exports = {
    deepClone,
}