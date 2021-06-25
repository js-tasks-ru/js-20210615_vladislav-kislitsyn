/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    // should return the same string if "size" parameter wasn\'t specified
    if (size === undefined)
        return string;

    const stack = [];
    let operationalSize = null;
    for (let char of string) {

        if (stack.length == 0 || stack.slice(-1)[0] != char){
            operationalSize = size;
        }

        if (!operationalSize)
            continue;
        
        --operationalSize;
        stack.push(char);        
    }

    return stack.join('');
}
