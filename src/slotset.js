/**
 * # SlotSet
 */

var Util = require('./util.js'),
    slots = {};

module.exports = {
    /**
     * ## set.get(name)
     * Safely fetch an existing ad slot or a mock slot if slot was not found.
     * @param {String} name Name of the ad slot.
     * @return {Object} The ad slot or a mock ad slot.
     */
    get: function (name) {
        return slots[name] || {
            on: Util.noop,
            setTargeting: Util.noop,
            mock: true
        };
    },
    /**
     * ## set.add(slot)
     * Add a new slot to the set.
     * @param {Slot} slot Ad slot to add to the set.
     * @return {Array} Collection of 0 or more ad slots.
     */
    add: function (slot) {
        slots[slot.name] = slot;
    },
    /**
     * ## set.has(name)
     * Check if the set contains a slot name.
     * @param {String} name Ad slot name.
     * @return {Boolean} True if the set contains this name.
     */
    has: function (name) {
        return name in slots;
    },
    /**
     * ## set.clear()
     * Reset the collection.
     */
    clear: function () {
        slots = {};
    }
};
