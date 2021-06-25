/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

    const pathArray = path.split('.');

    // getter itself
    return function getter(obj){

        const pathIterator = pathArray[Symbol.iterator]();
        // function expression to finally return property value
        const innerFun = function inner(obj, iterator, property){

            if(obj === undefined)
                return obj;

            const result = iterator.next();
            if (result.done){
                return obj[property];
            }

            return inner(obj[property], iterator, result.value);
        };

        const {value, done} = pathIterator.next();
        // returns target property value
        return innerFun(obj, pathIterator, value);

    };

}