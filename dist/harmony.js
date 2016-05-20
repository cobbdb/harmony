(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Harmony = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function () {
    throw Error('[BaseClass] Abstract method was called without definition.');
};

},{}],2:[function(require,module,exports){
module.exports = function (func, root, base) {
    return function () {
        var out,
            oldbase = root.base;

        // Rebind base for this specific method.
        root.base = base;
        out = func.apply(root, arguments);

        // Restore the original base object.
        root.base = oldbase;
        return out;
    };
};

},{}],3:[function(require,module,exports){
(function (global){
var BaseSwap = require('./base-swap.js'),
    Stub = require('./stub.js');

/**
 * @class BaseClass
 * @param {Object} [root] The most senior parent
 * of the inheritance chain.
 */
function contructor(root) {
    root = root || {};

    /**
     * Provide hook for subclasses.
     * @param {Object} [child] The next child.
     */
    root.extend = function (child) {
        var base = {
                base: root.base
            },
            key;
        child = child || {};
        root.base = base;

        for (key in root) {
            if (root[key] instanceof global.Function) {
                base[key] = BaseSwap(root[key], root, base.base);
            }
        }

        for (key in child) {
            root[key] = child[key];
        }

        // Execute any construction logic.
        if ('_create' in child) {
            root._create();
        } else {
            root._create = Stub;
        }

        return root;
    };

    /**
     * Run any construction logic.
     */
    if ('_create' in root) {
        root._create.call(root);
    } else {
        root._create = Stub;
    }

    return root;
}

contructor.Abstract = require('./abstract.js');
contructor.Stub = Stub;

module.exports = contructor;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./abstract.js":1,"./base-swap.js":2,"./stub.js":4}],4:[function(require,module,exports){
module.exports = function () {};

},{}],5:[function(require,module,exports){
(function (global){
/**
 * # Lumberjack
 * Set `localStorage.lumberjack` to `on` to enable logging.
 * @param {Boolean} enabled True to force logging regardless of
 * the localStorage setting.
 * @return {Object} A new Lumberjack.
 * @see GitHub-Page http://github.com/cobbdb/lumberjack
 */
module.exports = function (enabled) {
    var log,
        record = {},
        cbQueue = {},
        master = [],
        ls = global.localStorage || {};

    /**
     * ## log(channel, data)
     * Record a log entry for an channel.
     * @param {String} channel A string describing this channel.
     * @param {String|Object|Number|Boolean} data Some data to log.
     */
    log = function (channel, data) {
        var i, len, channel, entry;
        var channelValid = typeof channel === 'string';
        var dataType = typeof data;
        var dataValid = dataType !== 'undefined' && dataType !== 'function';
        if (ls.lumberjack !== 'on' && !enabled) {
            // Do nothing unless enabled.
            return;
        }
        if (channelValid && dataValid) {
            /**
             * All log entries take the form of:
             * ```javascript
             *  {
             *      time: // timestamp when entry was logged
             *      data: // the logged data
             *      channel: // channel of entry
             *      id: // id of entry in master record
             *  }
             * ```
             */
            entry = {
                time: new Date(),
                data: data,
                channel: channel,
                id: master.length
            };
            // Record the channel.
            record[channel] = record[channel] || []
            record[channel].push(entry);
            master.push(entry);

            // Perform any attached callbacks.
            cbQueue[channel] = cbQueue[channel] || [];
            len = cbQueue[channel].length;
            for (i = 0; i < len; i += 1) {
                cbQueue[channel][i](data);
            }
        } else {
            throw Error('Lumberjack Error: log(channel, data) requires an channel {String} and a payload {String|Object|Number|Boolean}.');
        }
    };

    /**
     * ## log.clear([channel])
     * Clear all data from a the log.
     * @param {String} [channel] Name of a channel.
     */
    log.clear = function (channel) {
        if (channel) {
            record[channel] = [];
        } else {
            record = {};
            master = [];
        }
    };

    /**
     * ## log.readback(channel, [pretty])
     * Fetch the log of an channel.
     * @param {String} channel A string describing this channel.
     * @param {Boolean} [pretty] True to create a formatted string result.
     * @return {Array|String} This channel's current record.
     */
    log.readback = function (channel, pretty) {
        var channelValid = typeof channel === 'string';
        if (channelValid) {
            if (pretty) {
                return JSON.stringify(record[channel], null, 4);
            }
            return record[channel] || [];
        }
        throw Error('log.readback(channel, pretty) requires an channel {String}.');
    };

    /**
     * ## log.readback.master([pretty])
     * Get a full readback of all channels' entries.
     * @param {Boolean} [pretty] True to create a formatted string result.
     * @return {Array|String} This log's master record.
     */
    log.readback.master = function (pretty) {
        if (pretty) {
            return JSON.stringify(master, null, 4);
        }
        return master;
    };

    /**
     * ## log.readback.channels([pretty])
     * Fetch list of log channels currently in use.
     * @param {Boolean} [pretty] True to create a formatted string result.
     * @return {Array|String} This log's set of used channels.
     */
    log.readback.channels = function (pretty) {
        var keys = Object.keys(record);
        if (pretty) {
            return JSON.stringify(keys);
        }
        return keys;
    };

    /**
     * ## log.flush([channel])
     * Flush all logs from a single channel or from the entire
     * system if no channel name is provided.
     * @param {String} [channel] Optional name of channel to flush.
     * @return {Array}
     */
    log.flush = function (channel) {
        var logs;
        if (channel) {
            logs = record[channel];
            record[channel] = [];
        } else {
            record = {};
            master = [];
            logs = [];
        }
        return logs;
    };

    /**
     * ## log.on(channel, cb)
     * Attach a callback to run anytime a channel is logged to.
     * @param {String} channel A string describing this channel.
     * @param {Function} cb The callback.
     */
    log.on = function (channel, cb) {
        var channelValid = typeof channel === 'string';
        var cbValid = typeof cb === 'function';
        if (channelValid && cbValid) {
            cbQueue[channel] = cbQueue[channel] || [];
            cbQueue[channel].push(cb);
        } else {
            throw Error('log.on(channel, cb) requires an channel {String} and a callback {Function}.');
        }
    };

    /**
     * ## log.off(channel)
     * Disable side-effects for a given channel.
     * @param {String} channel A string describing this channel.
     */
    log.off = function (channel) {
        var channelValid = typeof channel === 'string';
        if (channelValid) {
            cbQueue[channel] = [];
        } else {
            throw Error('log.off(channel) requires an channel {String}.');
        }
    };

    /**
     * ## log.enable()
     * Activate logging regardless of previous settings.
     */
    log.enable = function () {
        enabled = true;
    };

    /**
     * ## log.disable()
     * Force logging off.
     */
    log.disable = function () {
        enabled = false;
    };

    return log;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
/**
 * # Disable Action
 * Disable a single slot or group of slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js');

module.exports = {
    /**
     * ## harmony.disable.slot(name)
     * Marks this slot as ineligible to make ad calls.
     * @param {String} name
     */
    slot: function (name) {
        slots.get(name).enabled = false;
    },
    /**
     * ## harmony.disable.group(name)
     * Marks each slot in this group as ineligible to make ad calls.
     * @param {String} name
     */
    group: function (name) {
        var i,
            group = groups.get(name),
            len = group.length;
        for (i = 0; i < len; i += 1) {
            group[i].enabled = false;
        }
    }
};

},{"../group-set.js":12,"../slot-set.js":16}],7:[function(require,module,exports){
/**
 * # Enable Action
 * Enable a single slot or group of slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js');

module.exports = {
    /**
     * ## harmony.enable.slot(name)
     * Marks this slot as eligible to make ad calls.
     * @param {String} name
     */
    slot: function (name) {
        slots.get(name).enabled = true;
    },
    /**
     * ## harmony.enable.group(name)
     * Marks each slot in this group as eligible to make ad calls.
     * @param {String} name
     */
    group: function (name) {
        var i,
            group = groups.get(name),
            len = group.length;
        for (i = 0; i < len; i += 1) {
            group[i].enabled = true;
        }
    }
};

},{"../group-set.js":12,"../slot-set.js":16}],8:[function(require,module,exports){
(function (global){
/**
 * # Refresh Action
 * Refresh a single slot or group of slots. Will not
 * make ad calls for disabled slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js');

/**
 * ## harmony.refresh()
 * Call ```pubads().refresh()``` on all enabled slots in the page.
 */
module.exports = function () {
    var slot, name,
        set = [],
        map = slots.getAll();
    for (name in map) {
        slot = map[name];
        if (slot.enabled) {
            set.push(slot);
        }
    }
    global.googletag.pubads().refresh(set);
};

/**
 * ## harmony.refresh.slot(name)
 * Call ```pubads().refresh()``` on a slot if enabled.
 * @param {String} name
 */
module.exports.slot = function (name) {
    var slot = slots.get(name);
    if (!slot.mock && slot.enabled) {
        global.googletag.pubads().refresh([slot]);
    }
};

/**
 * ## harmony.refresh.group(name)
 * Call ```pubads().refresh()``` on a group of slots if enabled.
 * @param {String} name
 */
module.exports.group = function (name) {
    var i, slot,
        group = groups.get(name),
        len = group.length,
        set = [];
    for (i = 0; i < len; i += 1) {
        slot = group[i];
        if (slot.enabled) {
            set.push(slot);
        }
    }
    global.googletag.pubads().refresh(set);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../group-set.js":12,"../slot-set.js":16}],9:[function(require,module,exports){
(function (global){
var log = require('./log.js'),
    set = require('./slot-set.js'),
    BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js');

/**
 * # Ad Slot
 * Constructs a new adSlot in the page.
 * @type {BaseClass}
 * @extends {EventHandler}
 * @param {String} opts.name Slot name, ex) RP01
 * @param {String} opts.id Slot's div id, ex) ad-div-RP01
 * @param {Array} opts.sizes One or many 2D arrays, ex) [300, 250]
 * @param {String} opts.adunit Full ad unit code.
 * @param {Object} [opts.targeting] Slot-specific targeting.
 * @param {Array} [opts.mapping] Size mapping.
 * @param {Boolean} [opts.companion] True if companion ad.
 * @param {Boolean} [opts.drone] True when duplicates are anticipated.
 * @param {String} [opts.group] Slot group name.
 * @param {Boolean} [opts.interstitial] True if out-of-page ad.
 * @param {Boolean} [opts.enabled] False if ineligible to make ad calls.
 * @param {Object} [opts.on] Dictionary of callbacks.
 * @param {Object} [opts.one] Dictionary of single-run callbacks.
 * @return {AdSlot}
 */
module.exports = function (pubads, opts) {
    var slot, name, cbCache,
        // Capture timestamp for performance metrics.
        tsCreate = global.Date.now(),
        mapping = opts.mapping || [],
        companion = opts.companion || false,
        interstitial = opts.interstitial || false,
        targeting = opts.targeting || {};

    // Smoke test that the slot's element id is valid in the DOM.
    if (!global.document.getElementById(opts.id)) {
        throw global.Error('Ad slot container was not found in the DOM.');
    }

    // Define which type of slot this is.
    if (opts.interstitial) {
        slot = global.googletag.defineOutOfPageSlot(opts.adunit, opts.id);
    } else {
        slot = global.googletag.defineSlot(opts.adunit, opts.sizes, opts.id);
    }

    // Deep merge all event callbacks.
    cbCache = set.cached.callbacks(opts.name);
    opts.on = opts.on || [];
    for (name in opts.on) {
        cbCache.events[name] = cbCache.events[name] || [];
        cbCache.events[name] = [].concat(
            cbCache.events[name],
            opts.on[name]
        );
    }
    opts.one = opts.one || [];
    for (name in opts.one) {
        cbCache.singles[name] = cbCache.singles[name] || [];
        cbCache.singles[name] = [].concat(
            cbCache.singles[name],
            opts.one[name]
        );
    }

    /**
     * ## harmony.slot(name).on/one/off/trigger
     * Exposes event handling at the slot level.
     * @see event-handler.js
     */
    BaseClass(slot).extend(
        Eventable(cbCache)
    );

    /**
     * ## harmony.slot(name).divId
     * Slot's containing div id.
     * @type {String}
     */
    slot.divId = opts.id;
    /**
     * ## harmony.slot(name).name
     * Slot's name.
     * @type {String}
     */
    slot.name = opts.name;
    /**
     * ## harmony.slot(name).group
     * This slot's group.
     * @type {String}
     */
    slot.group = opts.group;
    /**
     * ## harmony.slot(name).sizes
     * This slot's possible sizes. Note, this is
     * not the current size of the ad slot.
     * @type {Array}
     */
    slot.sizes = opts.sizes;
    /**
     * ## harmony.slot(name).adunit
     * Ad unit code of this ad slot.
     * @type {String}
     */
    slot.adunit = opts.adunit;
    /**
     * ## harmony.slot(name).enabled
     * @type {Boolean}
     */
    slot.enabled = opts.enabled === false ? false : true;

    // Set slot-specific targeting. No need to introspect
    // because unused targeting is ignored by dfp.
    for (name in targeting) {
        slot.setTargeting(name, targeting[name]);
    }

    // Load in any targeting set before this slow was defined.
    targeting = set.cached.targeting(opts.name);
    for (name in targeting) {
        slot.setTargeting(name, targeting[name]);
    }

    // Assign size mapping for responsive ad slots.
    slot.defineSizeMapping(mapping);

    // Load any provided callback into queue.
    // ```opts.callback``` is legacy.
    if (typeof opts.callback === 'function') {
        slot.on('slotRenderEnded', opts.callback);
    }

    // Attach a listener for the slotRenderEnded event.
    pubads.addEventListener('slotRenderEnded', function (event) {
        var now;
        if (event.slot === slot) {
            now = global.Date.now();
            log('metric', {
                event: 'DFP Call Complete',
                slot: opts.name,
                timeSinceCalled: now - slot.tsCalled, // Can be NaN.
                timeSinceCreated: now - tsCreate
            });

            // Trigger any attached behaviors.
            slot.trigger('slotRenderEnded', event);
        }
    });

    // Assign companion ad service if requested.
    if (companion) {
        slot.addService(
            global.googletag.companionAds()
        );
    }

    // Add the publisher service and return the new slot.
    slot.addService(pubads);
    return slot;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./event-handler.js":11,"./log.js":14,"./slot-set.js":16,"baseclassjs":3}],10:[function(require,module,exports){
(function (global){
var BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js'),
    screen = require('./screen.js'),
    running = false,
    ready = true,
    breakpoints = [],
    last;

/**
 * # Breakpoint Watcher
 * @type {BaseClass}
 * @extends {EventHandler}
 */
module.exports = BaseClass({
    /**
     * ## watcher.current()
     * @return {Number} Current breakpoint.
     */
    current: function () {
        var i,
            len = breakpoints.length,
            width = screen.width(),
            point = breakpoints[len - 1];
        for (i = 0; i < len; i += 1) {
            if (width >= breakpoints[i]) {
                point = breakpoints[i];
                break;
            }
        }
        return point;
    },
    /**
     * ## watcher.add(set)
     * @param {Number|Array of Numbers} [set]
     */
    add: function (set) {
        breakpoints = breakpoints.concat(set || []);
        // Sort descending.
        breakpoints.sort(function (a, b) {
            return b - a;
        });
        module.exports.run();
    },
    /**
     * ## watcher.getAll()
     * @return {Array of Numbers}
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
     * ## watcher.run([throttle])
     * @param {Number} [throttle]
     */
    run: function (throttle) {
        function checkUpdate() {
            var current = module.exports.current();
            if (current !== last) {
                last = current;
                module.exports.trigger('update', current);
            }
        }

        // Do not run unless breakpoints are available.
        if (!running && breakpoints.length) {
            running = true;
            ready = true;
            global.addEventListener('resize', function () {
                if (ready) {
                    ready = false;
                    checkUpdate();

                    global.setTimeout(function () {
                        ready = true;
                    }, throttle || 250);
                }
            });
        }
        checkUpdate();
    }
}).extend(
    /**
     * ## watcher.on/one/off/trigger
     * @see event-handler.js
     */
    Eventable()
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./event-handler.js":11,"./screen.js":15,"baseclassjs":3}],11:[function(require,module,exports){
/**
 * # Eventable
 * Class for generic event handling.
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
 * @return {Object} Can be used by BaseClass.extend().
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

    return {
        /**
         * ## harmony.on(name, callback, [lazy])
         * Bind a callback to an event. Callback will run each
         * time the event is triggered.
         * @param {String} name Event name.
         * @param {Function} cb Event callback.
         * @param {Boolean} [lazy] True if this callback should not fire
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
         * @param {Boolean} [lazy] True if this callback should not fire
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
    };
};

},{}],12:[function(require,module,exports){
/**
 * # Slot-Group Set
 */

var Util = require('./util.js'),
    groups = {};

module.exports = {
    /**
     * ## set.get(name)
     * Fetch a group by name.
     * @param {String} name Name of the group.
     * @return {Array} Collection of 0 or more ad slots.
     */
    get: function (name) {
        return groups[name] || [];
    },
    /**
     * ## set.add(name, slot)
     * Add a slot to a group.
     * @param {Slot} slot Ad slot to add to the group.
     * @return {Array} Collection of 0 or more ad slots.
     */
    add: function (name, slot) {
        groups[name] = groups[name] || [];
        groups[name].push(slot);
        return groups[name];
    },
    /**
     * ## set.clear()
     * Reset the collection.
     */
    clear: function () {
        groups = {};
    }
};

},{"./util.js":17}],13:[function(require,module,exports){
(function (global){
/**
 * # Harmony
 * ### ***DFP JavaScript API Helper***
 */

var Util = require('./util.js'),
    AdSlot = require('./adslot.js'),
    log = require('./log.js'),
    slots = require('./slot-set.js'),
    groups = require('./group-set.js'),
    BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js'),
    watcher = require('./breakpoint-watcher.js');

/**
 * ## Harmony()
 * Create a new instance of Harmony.
 * @param {Boolean} [opts.forceLog] True to force Lumberjack logging enabled.
 * @return {Object} Instance of Harmony.
 */
module.exports = function (opts) {
    opts = opts || {};
    if (opts.forceLog) {    
        log.enable();
    }
    log('init', 'Harmony defined.');

    return BaseClass({
        _create: function () {
            var that = this;
            /**
             * ## harmony.on('breakpoint/update', callback)
             * ```javascript
             * harmony.on('breakpoint/update', function (bp) {});
             * harmony.one('breakpoint/update', function (bp) {});
             * harmony.off('breakpoint/update', function (bp) {});
             * ```
             * @param {Function} callback Called on new breakpoint.
             * @see event-handler.js
             */
            watcher.on('update', function (bp) {
                that.trigger('breakpoint/update', bp);
            });
            /**
             * ## harmony.on('slotRenderEnded', callback)
             * @param {Function} callback Called each time any ad call completes.
             * @see event-handler.js
             */
            try {
                global.googletag.pubads().addEventListener('slotRenderEnded', function (event) {
                    that.trigger('slotRenderEnded', event);
                });
            } catch (err) {
                log('error', 'It appears "googletag" is not defined!');
            }
        },
        /**
         * ## harmony.version
         * @type {String}
         */
        version: '3.2.0',
        /**
         * ## harmony.load(opts)
         * Load a block of configuration.
         * @param {Object} [opts.targeting] System-level targeting.
         * @param {Array of Objects} [opts.slots] Set of ad slot configurations.
         * @param {Number|Array of Numbers} [opts.breakpoints] Set of breakpoints.
         * @see adslot.js
         */
        load: function (opts) {
            var pubads = global.googletag.pubads();

            opts = opts || {};
            opts.slots = opts.slots || [];

            // Generate the ad slots.
            var i, slot, conf,
                len = opts.slots.length;
            log('load', 'Generating ad slots.');
            for (i = 0; i < len; i += 1) {
                conf = opts.slots[i];
                try {
                    slot = AdSlot(
                        pubads,
                        Util.scrubConf(conf)
                    );
                    slots.add(slot);
                    groups.add(slot.group, slot);
                } catch (err) {
                    log('error', {
                        msg: 'Slot failed to load during call to load().',
                        conf: conf,
                        err: err
                    });
                }
            }

            // Assign the system targeting.
            var key, value,
                targeting = opts.targeting || {};
            log('load', 'Applying pubads targeting.');
            for (key in targeting) {
                value = targeting[key];
                log('load', '- ' + key + ' = ' + value);
                pubads.setTargeting(key, value);
            }

            // Assign the breakpoints.
            watcher.add(opts.breakpoints);

            log('load', 'Harmony config loaded.');
        },
        /**
         * ## harmony.addBreakpoints(set)
         * Add breakpoint values in pixels.
         * @param {Number|Array of Numbers} [set] Breakpoints in pixels.
         * @see breakpoint-watcher.js
         */
        addBreakpoints: watcher.add,
        /**
         * ## harmony.getBreakpoints()
         * Fetch the list of breakpoints already loaded into the system.
         * @return {ArrayOfNumber}
         */
        getBreakpoints: watcher.getAll,
        /**
         * ## harmony.log
         * Instance of Lumberjack populated with Harmony's data.
         * @see log.js
         */
        log: log,
        /**
         * ## harmony.slot(name)
         * Safely fetch an existing ad slot or a mock slot if slot was not found.
         * @param {String} name Name of the ad slot.
         * @return {Object} The ad slot or a mock ad slot.
         * @see slot-set.js
         */
        slot: slots.get,
        /**
         * ## harmony.hasSlot(name)
         * Check if a slot has already been loaded into Harmony.
         * @param {String} name Name of the ad slot.
         * @return {Boolean} True if the slot has already been loaded.
         * @see slot-set.js
         */
        hasSlot: slots.has,
        /**
         * ## harmony.group(name)
         * Fetch a slot group by name.
         * @param {String} name Name of the slot group.
         * @return {Array} Collection of 0 or more ad slots.
         * @see group-set.js
         */
        group: groups.get,
        /**
         * ## harmony.defineSlot(opts)
         * Create a new adSlot in the page.
         * @param {String} opts.name Slot name, ex) RP01
         * @param {String} opts.id Slot's div id, ex) ad-div-RP01
         * @param {Array} opts.sizes One or many 2D arrays, ex) [300, 250]
         * @param {String} opts.adunit Full ad unit code.
         * @param {Object} [opts.targeting] Slot-specific targeting.
         * @param {Array} [opts.mapping] Size mapping.
         * @param {Boolean} [opts.companion] True if companion ad.
         * @param {Boolean} [opts.drone] True when duplicates are anticipated.
         * @param {String} [opts.group] Slot group name.
         * @param {Boolean} [opts.interstitial] True if out-of-page ad.
         * @param {Boolean} [opts.enabled] False if ineligible to make ad calls.
         * @param {Object} [opts.on] Dictionary of callbacks.
         * @param {Object} [opts.one] Dictionary of single-run callbacks.
         * @return {AdSlot}
         * @see adslot.js
         */
        defineSlot: function (opts) {
            var slot;
            try {
                slot = AdSlot(
                    global.googletag.pubads(),
                    Util.scrubConf(opts)
                );
                slots.add(slot);
                groups.add(opts.group, slot);
            } catch (err) {
                log('error', {
                    msg: 'Slot failed to load during call to defineSlot()',
                    conf: opts,
                    err: err
                });
            }
            return slot;
        },
        /**
         * ## harmony.enable
         * ### harmony.enable.slot(name)
         * ### harmony.enable.group(name)
         * Marks slots as eligible to make ad calls.
         * @see actions/enable.js
         */
        enable: require('./actions/enable.js'),
        /**
         * ## harmony.disable
         * ### harmony.disable.slot(name)
         * ### harmony.disable.group(name)
         * Marks slots as ineligible to make ad calls.
         * @see actions/disable.js
         */
        disable: require('./actions/disable.js'),
        /**
         * ## harmony.refresh
         * ### harmony.refresh.slot(name)
         * ### harmony.refresh.group(name)
         * Refresh a single slot or group of slots.
         * @see actions/refresh.js
         */
        refresh: require('./actions/refresh.js'),
        /**
         * ## harmony.show
         * Showing a slot means setting style ```display:block``` and
         * calling ```googletag.display()```. Will not call
         * ```googletag.display()``` on disabled slots.
         */
        show: {
            /**
             * ### harmony.show.group(name)
             * Show all ads in a slot group.
             * @param {String} name
             */
            group: function (name) {
                var i, slot, el,
                    set = groups.get(name),
                    len = set.length;
                log('show', {
                    msg: 'Showing ads in group',
                    group: name
                });
                try {
                    for (i = 0; i < len; i += 1) {
                        slot = set[i];
                        slot.tsCalled = global.Date.now();

                        // Only make ad call if slot is enabled.
                        if (slot.enabled) {
                            global.googletag.display(slot.divId);
                        }

                        el = document.getElementById(slot.divId);
                        if (el) {
                            el.style.display = 'block';
                        } else {
                            log('error', {
                                msg: 'Failed to show slot for group',
                                group: name,
                                reason: 'Slot was missing from the DOM',
                                slot: slot
                            });
                        }
                    }
                } catch (err) {
                    log('error', {
                        msg: 'Failed to show group',
                        group: name,
                        err: err
                    });
                }
            },
            /**
             * ### harmony.show.slot(name)
             * Show a single ad slot.
             * @param {String} name
             */
            slot: function (name) {
                var slot, el;
                log('show', {
                    msg: 'Showing slot',
                    name: name
                });
                try {
                    slot = slots.get(name);
                    slot.tsCalled = global.Date.now();

                    // Only make ad call if slot is enabled.
                    if (slot.enabled) {
                        global.googletag.display(slot.divId);
                    }

                    el = document.getElementById(slot.divId);
                    el.style.display = 'block';
                } catch (err) {
                    log('error', {
                        msg: 'Failed to show slot',
                        name: name,
                        err: err
                    });
                }
            }
        },
        /**
         * ## harmony.hide
         * Hiding an ad means setting style ```display:none```.
         */
        hide: {
            /**
             * ### harmony.hide.group(name)
             * Hides all the ads in a slot group.
             * @param {String} name
             */
            group: function (name) {
                var i, el,
                    set = groups.get(name),
                    len = set.length;
                log('hide', 'Hiding ads in group ' + name);
                for (i = 0; i < len; i += 1) {
                    el = document.getElementById(set[i].divId);
                    if (el) {
                        el.style.display = 'none';
                    } else {
                        log('error', {
                            msg: 'Failed to hide slot in group',
                            group: name,
                            reason: 'Slot was missing from the DOM',
                            id: set[i].divId
                        });
                    }
                }
            },
            /**
             * ### harmony.hide.slot(name)
             * Hides a single ad slot.
             * @param {String} name
             */
            slot: function (name) {
                var el,
                    slot = slots.get(name);
                log('hide', {
                    msg: 'Hiding slot',
                    name: name
                });
                try {
                    el = document.getElementById(slot.divId);
                    el.style.display = 'none';
                } catch (err) {
                    log('error', {
                        msg: 'Failed to hide slot',
                        name: name,
                        err: err
                    });
                }
            }
        }
    }).extend(
        /**
         * ## harmony.on/one/off/trigger
         * Exposes event handling at the system level.
         * @see event-handler.js
         */
        Eventable()
    );
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./actions/disable.js":6,"./actions/enable.js":7,"./actions/refresh.js":8,"./adslot.js":9,"./breakpoint-watcher.js":10,"./event-handler.js":11,"./group-set.js":12,"./log.js":14,"./slot-set.js":16,"./util.js":17,"baseclassjs":3}],14:[function(require,module,exports){
/**
 * # log
 */

var Lumberjack = require('lumberjackjs');

// Instance of Lumberjack.
module.exports = Lumberjack();

},{"lumberjackjs":5}],15:[function(require,module,exports){
(function (global){
/**
 * # Screen
 * Viewport size utility.
 */
module.exports = {
    /**
     * ## screen.width()
     * @return {Number} Width of the viewport.
     */
    width: function () {
        return (
            global.innerWidth ||
            global.document.documentElement.clientWidth ||
            global.document.body.clientWidth
        );
    },
    /**
     * ## screen.height()
     * @return {Number} Height of the viewport.
     */
    height: function () {
        return (
            global.innerHeight ||
            global.document.documentElement.clientHeight ||
            global.document.body.clientHeight
        );
    }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
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
     * @return {Array} Collection of 0 or more ad slots.
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

},{"./util.js":17}],17:[function(require,module,exports){
/**
 * # Utilities
 */

var slots = require('./slot-set.js');

module.exports = {
    /**
     * ## Util.noop()
     * Simple no-op.
     */
    noop: function () {},
    /**
     * ## Util.slotCount
     * Counter for ensuring unique ad slots.
     */
    slotCount: 0,
    /**
     * ## Util.scrubConf(conf)
     * Ensures a slot's name and id are unique in the page. If a
     * container has content, it is assumed that an ad call has already
     * been made.
     * @param {Object} conf Configuration for a single ad slot.
     * @return {Object} Clean slot configuration.
     */
    scrubConf: function (conf) {
        var suffix, el,
            temp = {
                el: {}
            };

        // Only do work if there are multiple instances or if drone slot.
        if (conf.drone || slots.has(conf.name)) {
            do {
                el = document.getElementById(conf.id);
                if (el) {
                    if (el.innerHTML) {
                        // Slot has already been processed,
                        // so move it aside and query again.
                        temp.el = el;
                        temp.id = el.id;
                        el.id = 'h-temp';
                    } else {
                        this.slotCount += 1;
                        suffix = '-h' + this.slotCount;
                        el.id += suffix;
                        // Restore any existing slot.
                        temp.el.id = temp.id;
                        conf.id = el.id;
                        conf.name += suffix;
                        return conf;
                    }
                }
            } while (el);
            throw Error('Ad slot container was not found in the DOM.');
        }
        return conf;
    }
};

},{"./slot-set.js":16}]},{},[13])(13)
});