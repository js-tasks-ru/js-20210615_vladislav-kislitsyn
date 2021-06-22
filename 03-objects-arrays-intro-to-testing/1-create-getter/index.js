/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

    // getter itself
    return function getter(obj){
        
        const pathArray = path.split('.');

        // function expression to finally return property value
        const innerFun = function inner(obj, properties){
            
            if(obj === undefined)
                return obj;

            const property = properties.shift();
            if (!properties.length){
                return obj[property];
            }

            return inner(obj[property], properties);
        }

        // returns target property value
        return innerFun(obj, pathArray);

    };

}