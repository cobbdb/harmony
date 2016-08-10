/**
 * # Slot Cache
 * Cache for slots that haven't been created yet.
 */

var singles = {},
    events = {},
    targeting = {};

/**
 * ## Cache(name)
 * @constructor
 * @param {string} name Name of this group.
 * @return {SlotCache}
 */
module.exports = function (slot) {
    return {
        /**
         * ## cache.set
         * @type {Object}
         */
        set: {
            /**
             * ### event(name, callback)
             * @param {string} name
             * @param {function} cb
             */
            event: function (name, cb) {
                var cache = events[slot] = events[slot] || {};
                cache[name] = cache[name] || [];
                cache[name].push(cb);
            },
            /**
             * ### single(name, callback)
             * @param {string} name
             * @param {function} cb
             */
            single: function (name, cb) {
                var cache = singles[slot] = singles[slot] || {};
                cache[name] = cache[name] || [];
                cache[name].push(cb);
            },
            /**
             * ### targeting(name, value)
             * @param {string} name
             * @param {string} value
             */
            targeting: function (name, value) {
                targeting[slot] = targeting[slot] || {};
                targeting[slot][name] = value;
            }
        },
        /**
         * ## cache.get
         * @type {Object}
         */
        get: {
            /**
             * ### events(name)
             * @param {string} name
             * @return {!function[]}
             */
            events: function () {
                return events[slot] || [];
            },
            /**
             * ### singles(name)
             * @param {string} name
             * @return {!function[]}
             */
            singles: function () {
                return singles[slot] || [];
            },
            /**
             * ### targeting(name)
             * @param {string} name
             * @return {!Object<string, string>}
             */
            targeting: function () {
                return targeting[slot] || {};
            }
        }
    };
};

/**
 * ## cache.clear()
 * Flush all data from cache.
 */
module.exports.clear = function () {
    singles = {};
    events = {};
    targeting = {};
};
