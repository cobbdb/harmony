/**
 * # Slot-Set
 */

var Util = require('./util.js'),
    slots = {},
    cache = {
        events: {},
        singles: {},
        targ: {}
    };

module.exports = {
    cached: {
        /**
         * ## set.cached.callbacks(name)
         * Fetch any cached callbacks for this slot.
         * @param {String} slotname Name of the ad slot.
         * @return {Object} Dictionary of events and
         * their callbacks as an Array.
         */
        callbacks: function (slotname) {
            return {
                events: cache.events[slotname] || {},
                singles: cache.singles[slotname] || {}
            };
        },
        /**
         * ## set.cached.targeting(name)
         * Fetch any cached targeting for this slot.
         * @param {String} name Name of the ad slot.
         * @return {Object} Dictionary of targeting or
         * empty object.
         */
        targeting: function (name) {
            return cache.targ[name] || {};
        }
    },
    /**
     * ## set.get(name)
     * Safely fetch an existing ad slot or a mock slot if slot was not found.
     * @param {String} name Name of the ad slot.
     * @return {Object} The ad slot or a mock ad slot.
     */
    get: function (name) {
        return slots[name] || {
            // Allow events to queue up before this slot
            // has been defined.
            on: function (evtname, cb) {
                cache.events[name] = cache.events[name] || {};
                cache.events[name][evtname] = [].concat(
                    cache.events[name][evtname] || [],
                    cb
                );
            },
            one: function (evtname, cb) {
                cache.singles[name] = cache.singles[name] || {};
                cache.singles[name][evtname] = [].concat(
                    cache.singles[name][evtname] || [],
                    cb
                );
            },
            // Allow targeting to queue up before this
            // slot has been defined.
            setTargeting: function (key, value) {
                cache.targ[name] = cache.targ[name] || {};
                cache.targ[name][key] = value;
            },
            trigger: Util.noop,
            off: Util.noop,
            mock: true
        };
    },
    /**
     * ## set.add(slot)
     * Add a new slot to the set.
     * @param {Slot} slot Ad slot to add to the set.
     * @return {Slot[]} Collection of 0 or more ad slots.
     */
    add: function (slot) {
        slots[slot.name] = slot;
    },
    /**
     * ## set.getAll()
     * @return {Object} Map of all slots in the system.
     */
    getAll: function () {
        return slots;
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
        cache.events = {};
        cache.singles = {};
        cache.targ = {};
    }
};
