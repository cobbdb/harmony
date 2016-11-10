var EventHandler = require('../types/event-handler.js'),
    events = EventHandler(),
    running = false,
    working = false,
    breakpoints = [],
    last;

/**
 * # Breakpoint Watcher
 * @type {BreakpointWatcher}
 * @extends {EventHandler}
 */
module.exports = {
    on: events.on,
    one: events.one,
    off: events.off,
    trigger: events.trigger,
    /**
     * ## watcher.current()
     * @return {?Number} Current breakpoint. Defaults to `1`.
     * Returns `undefined` if no breakpoints have been set.
     */
    current: function () {
        var point = 1;
        breakpoints.forEach(function (bp) {
            if (global.innerWidth >= bp) {
                point = bp;
            }
        });
        return breakpoints.length ? point : void(0);
    },
    /**
     * ## watcher.add(set)
     * @param {Number|Number[]} [set]
     */
    add: function (set) {
        breakpoints = breakpoints.concat(set || []);
        // Sort ascending.
        breakpoints.sort(function (a, b) {
            return a - b;
        });
        module.exports.run();
    },
    /**
     * ## watcher.getAll()
     * @return {Number[]}
     */
    getAll: function () {
        return breakpoints;
    },
    /**
     * ## watcher.clear()
     * Clears all breakpoints from the system.
     */
    clear: function () {
        breakpoints = [];
    },
    /**
     * ## watcher.run(throttle)
     * Uses RAF to monitor breakpoint changes.
     */
    run: function () {
        function checkUpdate() {
            var current = module.exports.current();
            if (current !== last) {
                last = current;
                events.trigger('update', current);
            }
        }

        // Do not run unless breakpoints are available.
        if (!running && breakpoints.length) {
            running = true;
            global.addEventListener('resize', function () {
                if (!working) {
                    working = true;
                    global.requestAnimationFrame(function () {
                        checkUpdate();
                        working = false;
                    });
                }
            });
        }
        checkUpdate();
    }
};
