/**
 * # Slot Cache
 * Cache for slots that haven't been created yet.
 */

var bank = {},
    singles = {},
    events = {},
    targeting = {},
    configs = {};

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
            },
            /**
             * ### cache.set.config(opts)
             * @param {Object} opts
             */
            config: function (opts) {
                configs[opts.name] = opts;
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
            event: function (name) {
                return events[name] || [];
            },
            /**
             * ### cache.get.single(name)
             * @param {string} name
             * @return {!function(?)[]}
             */
            single: function (name) {
                return singles[name] || [];
            },
            /**
             * ### cache.get.targeting(name)
             * @param {string} name
             * @return {!Object<string, string>}
             */
            targeting: function (name) {
                return targeting[name] || {};
            },
            /**
             * ### cache.get.config(name)
             * @param {string} name
             * @return {!Object<string, *>} Slot's configuration options.
             */
            config: function (name) {
                return configs[name] || {};
            }
        },
        /**
         * ## cache.has
         * @type {Object<string, function>}
         */
        has: {
            /**
             * ### cache.has.event(name)
             * @param {string} name
             * @return {!boolean}
             */
            event: function (name) {
                return name in events;
            },
            /**
             * ### cache.has.single(name)
             * @param {string} name
             * @return {!boolean}
             */
            single: function (name) {
                return name in singles;
            },
            /**
             * ### cache.has.targeting(name)
             * @param {string} name
             * @return {!boolean}
             */
            targeting: function (name) {
                return name in targeting;
            },
            /**
             * ### cache.has.config(name)
             * @param {string} name
             * @return {!boolean}
             */
            config: function (name) {
                return name in configs;
            }
        }
    };
    return bank[slot];
};
