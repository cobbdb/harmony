/**
 * # Slot Cache
 * Cache for slots that haven't been created yet.
 */

var bank = {},
    singles = {},
    events = {},
    targeting = {};

/**
 * ## Cache(name)
 * @constructor
 * @param {string} name Name of this group.
 * @return {SlotCache}
 */
module.exports = function (slot) {
    bank[slot] = bank[slot] || {
        /**
         * ## cache.set
         * @type {Object<string, function>}
         */
        set: {
            /**
             * ### cache.set.event(name, callback)
             * @param {string} name
             * @param {function(?)} cb
             */
            event: function (name, cb) {
                var cache = events[slot] = events[slot] || {};
                cache[name] = cache[name] || [];
                cache[name].push(cb);
            },
            /**
             * ### cache.set.single(name, callback)
             * @param {string} name
             * @param {function(?)} cb
             */
            single: function (name, cb) {
                var cache = singles[slot] = singles[slot] || {};
                cache[name] = cache[name] || [];
                cache[name].push(cb);
            },
            /**
             * ### cache.set.targeting(name, value)
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
         * @type {Object<string, function>}
         */
        get: {
            /**
             * ### cache.get.event(name)
             * @param {string} name
             * @return {!function(?)[]}
             */
            events: function () {
                return events[slot] || [];
            },
            /**
             * ### cache.get.single(name)
             * @param {string} name
             * @return {!function(?)[]}
             */
            singles: function () {
                return singles[slot] || [];
            },
            /**
             * ### cache.get.targeting(name)
             * @param {string} name
             * @return {!Object<string, string>}
             */
            targeting: function () {
                return targeting[slot] || {};
            }
        }
    };
    return bank[slot];
};

/**
 * ## cache.clear()
 * Flush all data from cache.
 */
module.exports.clear = function () {
    bank = {};
};
