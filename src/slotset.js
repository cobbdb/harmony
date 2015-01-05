/**
 * # SlotSet
 */

var Util = require('./util.js'),
    slots = {},
    cache = {
        cb: {},
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
            return cache.cb[slotname] || {};
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
                cache.cb[name] = cache.cb[name] || {};
                cache.cb[name][evtname] = cache.cb[name][evtname] || [];
                cache.cb[name][evtname].push(cb);
            },
            // Allow targeting to queue up before this
            // slot has been defined.
            setTargeting: function (key, value) {
                cache.targ[name] = cache.targ[name] || {};
                cache.targ[name][key] = value;
            },
            trigger: Util.noop,
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
        cache.cb = {};
        cache.targ = {};
    }
};
