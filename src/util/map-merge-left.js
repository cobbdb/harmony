/**
 * # Map Merge Left
 * Shallow merge two Objects.
 * @param {Object<string, *>} first
 * @param {Object<string, *>} second
 * @return {Object<string, *>}
 */
module.exports = function (first, second) {
    var key;
    first = first || {};
    second = second || {};
    for (key in second) {
        first[key] = second[key];
    }
    return first;
};
