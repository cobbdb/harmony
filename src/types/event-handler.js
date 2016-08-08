/**
 * # Eventable
 * Class for generic event handling.
 * ```javascript
 * EventHandler({
 *     events: {
 *         eventName: function () {},
 *         otherName: function () {}
 *     },
 *     singles: {
 *         anotherName: function () {}
 *     }
 * })
 * ```
 * @constructor
 * @param {Object<string, (function|function[])>} [opts.events] Event callbacks to fire each time
 * the event is triggered.
 * @param {Object<string, (function|function[])>} [opts.singles] Event callbacks to fire only once
 * the next time the event is triggered.
 * @return {EventHandler}
 */
module.exports = function (opts) {
    var events = {},
        singles = {},
        name,
        /**
         * ## triggerCache
         * Cache of events that have already been triggered once.
         * @private
         * @type {Object<string, !*>}
         */
        triggerCache = {};

    // Load in the initial callbacks.
    opts = opts || {};
    for (name in opts.events) {
        events[name] = opts.events[name];
    }
    for (name in opts.singles) {
        singles[name] = opts.singles[name];
    }

    return {
        /**
         * ## handler.on(name, callback, [lazy])
         * Bind a callback to an event. Callback will run each
         * time the event is triggered.
         * @param {string} name Event name.
         * @param {function(?)} cb Event callback.
         * @param {boolean} [lazy] True if this callback should not fire
         * immediately if the event has already been triggered.
         */
        on: function (name, cb, lazy) {
            if (!lazy && name in triggerCache) {
                cb(triggerCache[name]);
            }
            events[name] = events[name] || [];
            events[name].push(cb);
        },
        /**
         * ## handler.one(name, callback, [lazy])
         * Bind a callback to an event. Callback will run only
         * once the next time the event is triggered.
         * @param {string} name Event name.
         * @param {function(?)} cb Event callback.
         * @param {boolean} [lazy] True if this callback should not fire
         * immediately if the event has already been triggered.
         */
        one: function (name, cb, lazy) {
            if (!lazy && name in triggerCache) {
                cb(triggerCache[name]);
            } else {
                singles[name] = singles[name] || [];
                singles[name].push(cb);
            }
        },
        /**
         * ## handler.off([name])
         * Clear all callbacks from an event.
         * @param {string} [name] Event name. Empty to
         * clear all callbacks from the system.
         */
        off: function (name) {
            if (name) {
                events[name] = [];
                singles[name] = [];
            } else {
                events = {};
                singles = {};
                triggerCache = {};
            }
        },
        /**
         * ## handler.trigger(name, [data])
         * Immediately trigger an event.
         * @param {string} name Event name.
         * @param {*} [data] Any data you wish to provide to all
         * event callbacks.
         */
        trigger: function (name, data) {
            if (name in events) {
                events[name].forEach(function (cb) {
                    cb(data);
                });
            }
            if (name in singles) {
                singles[name].forEach(function (cb) {
                    cb(data);
                });
                singles[name] = [];
            }
            // Cache that this event has fired.
            triggerCache[name] = data;
        }
    };
};
