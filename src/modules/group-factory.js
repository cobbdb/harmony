/**
 * # Group Factory
 */

var Group = require('../types/group.js'),
    cache = {};

module.exports = {
    /**
     * ## Groups.clear()
     */
    clear: function () {
        cache = {};
    },
    /**
     * ## Groups.create(name)
     * @param {string} name
     * @return {Group}
     */
    create: function (name) {
        cache[name] = cache[name] || Group(name);
        return cache[name];
    }
};
