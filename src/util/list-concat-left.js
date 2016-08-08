/**
 * # List Concat Left
 * Concat arrays across two Objects for all keys.
 * @param {Object<string, Array>} first
 * @param {Object<string, Array>} second
 * @return {Object<string, Array>}
 */
module.exports = function (first, second) {
    var name;
    first = first || [];
    second = second || [];
    for (name in second) {
        first[name] = [].concat(
            first[name] || [],
            second[name]
        );
    }
    return first;
};
