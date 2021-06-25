/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    // should return "undefined" if object wasn\'t passed
    if (obj === undefined)
        return obj;

    // swap object keys and values
    return Object.fromEntries(
        Object.entries(obj).map(
            ([key, value]) => [value, key]
        ));
}
