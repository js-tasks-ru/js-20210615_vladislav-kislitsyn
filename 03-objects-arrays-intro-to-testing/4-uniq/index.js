/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    // should return empty array if arguments wasn't passed
    if (arr === undefined)
        return [];

    const uniqueNums = new Set(arr);
    return Array.from(uniqueNums);
}
