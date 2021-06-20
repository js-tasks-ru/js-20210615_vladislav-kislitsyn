/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

    return [...arr].sort(
        function(a, b){
            let ret = a.localeCompare(b, 'ru-u-kf-upper');
            return param === 'asc' ? ret : -ret;
        }
    );
}