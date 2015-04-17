var BaseClass = require('baseclassjs');

/**
 * # Eventable
 * BaseClass Interface for generic event handling.
 * Initial events are loaded as a generic object of ```<name>:<callback>```.
 * For example:
 * ```javascript
 * Eventable({
 *     events: {
 *         eventName: function () {},
 *         otherName: [
 *             function () {},
 *             function () {}
 *         ]
 *     },
 *     singles: {
 *         anotherName: function () {}
 *     }
 * })
 * ```
 * @param {Object} [opts.events] Event callbacks to fire each time
 * the event is triggered.
 * @param {Object} [opts.singles] Event callbacks to fire only once
 * the next time the event is triggered.
 */
module.exports = function (opts) {
    var events = {},
        singles = {},
        name,
        // Cache of events that have already been triggered once.
        triggerCache = {};

    // Load in the initial callbacks.
    opts = opts || {};
    for (name in opts.events) {
        events[name] = [].concat(
            opts.events[name] || []
        );
    }
    for (name in opts.singles) {
        singles[name] = [].concat(
            opts.singles[name] || []
        );
    }

    return BaseClass.Interface({
        /**
         * ## harmony.on(name, callback, [lazy])
         * Bind a callback to an event. Callback will run each
         * time the event is triggered.
         * @param {String} name Event name.
         * @param {Function} cb Event callback.
         * @param {Boolean} lazy True if this callback should not fire
         * immediately if the event has already been triggered.
         */
        on: function (name, cb, lazy) {
            if (!lazy && name in triggerCache) {
                cb.call(this, triggerCache[name].data);
            }
            events[name] = events[name] || [];
            events[name].push(cb);
        },
        /**
         * ## harmony.one(name, callback, [lazy])
         * Bind a callback to an event. Callback will run only
         * once the next time the event is triggered.
         * @param {String} name Event name.
         * @param {Function} cb Event callback.
         * @param {Boolean} lazy True if this callback should not fire
         * immediately if the event has already been triggered.
         */
        one: function (name, cb, lazy) {
            if (!lazy && name in triggerCache) {
                cb.call(this, triggerCache[name].data);
            } else {
                singles[name] = singles[name] || [];
                singles[name].push(cb);
            }
        },
        /**
         * ## harmony.off(name)
         * Clear all callbacks from an event.
         * @param {String} name Event name.
         */
        off: function (name) {
            events[name] = [];
            singles[name] = [];
        },
        /**
         * ## harmony.trigger(name, data)
         * Immediately trigger an event.
         * @param {String} name Event name.
         * @param {Any} [data] Any data you wish to provide to all
         * event callbacks.
         */
        trigger: function (name, data) {
            var that = this;
            if (name in events) {
                events[name].forEach(function (cb) {
                    cb.call(that, data);
                });
            }
            if (name in singles) {
                singles[name].forEach(function (cb) {
                    cb.call(that, data);
                });
                singles[name] = [];
            }
            // Cache that this event has fired.
            triggerCache[name] = {
                data: data
            };
        }
    });
};
