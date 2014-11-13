/**
 * # BreakpointSet
 */

var Util = require('./util.js'),
    breakpoints = {};

module.exports = {
    /**
     * ## set.get(name)
     * Fetch a breakpoint by name.
     * @param {String} name Name of the breakpoint.
     * @return {Array} Collection of 0 or more ad slots.
     */
    get: function (name) {
        return breakpoints[name] || [];
    },
    /**
     * ## set.add(name, slot)
     * Add a new slot to a breakpoint.
     * @param {Slot} slot Ad slot to add to the set.
     * @return {Array} Collection of 0 or more ad slots.
     */
    add: function (name, slot) {
        breakpoints[name] = breakpoints[name] || [];
        breakpoints[name].push(slot);
        return breakpoints[name];
    }
};
