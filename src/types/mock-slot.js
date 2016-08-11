/**
 * # Mock Slot
 * Useful for caching data until the matching Slot is defined.
 * @see types/slot.js
 */

var SlotCache = require('../modules/slot-cache.js'),
    stub = function () {};

/**
 * ## MockSlot(name)
 * @constructor
 * @type {MockSlot}
 * @param {!string} name
 */
module.exports = function (name) {
    var cache = SlotCache(name);
    return {
        /**
         * ### gpt
         * @type {Object}
         */
        gpt: {
            /**
             * #### setTargeting(key, value)
             * @type {function(string, string)}
             * @see https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_setTargeting
             */
            setTargeting: cache.set.targeting
        },
        /**
         * ### mock
         * @type {!boolean} Always true.
         */
        mock: true,
        /**
         * ### name
         * @type {string}
         */
        name: name,
        /**
         * ### off()
         * Does nothing.
         * @type {function}
         */
        off: stub,
        /**
         * ### on()
         * Caches the callback for an event until the matching Slot is defined.
         * @type {function(string, function)}
         */
        on: cache.set.event,
        /**
         * ### one()
         * Caches the callback for an event until the matching Slot is defined.
         * @type {function(string, function)}
         */
        one: cache.set.single,
        /**
         * ### trigger()
         * Does nothing.
         * @type {function}
         */
        trigger: stub
    };
};
