/**
 * # List Concat Left
 * Concat arrays across two Objects for all keys.
 * @param {Object<string, (function|function[])>} first
 * @param {Object<string, (function|function[])>} second
 * @return {!Object<string, function[]>}
 */
module.exports = function (first, second) {
    var name;
    first = first || {};
    second = second || {};
    for (name in first) {
        first[name] = [].concat(first[name]);
    }
    for (name in second) {
        first[name] = [].concat(
            first[name] || [],
            second[name]
        );
    }
    return first;
};
