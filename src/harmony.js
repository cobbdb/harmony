/**
 * # Harmony
 * ### ***Simplify your DFP business logic.***
 */

var Util = require('./util.js'),
    AdSlot = require('./adslot.js'),
    log = require('./log.js'),
    slots = require('./slot-set.js'),
    groups = require('./group-set.js'),
    BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js'),
    watcher = require('./breakpoint-watcher.js');

log('init', 'Harmony defined.');

/**
 * ## harmony
 * @type {Object}
 */
module.exports = BaseClass({
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
    version: require('../package.json').version,
    /**
     * ## harmony.load(config)
     * Load a block of configuration.
     * @see actions/load.js
     */
    load: require('./actions/load.js'),
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
     * @see breakpoint-watcher.js
     */
    getBreakpoints: watcher.getAll,
    /**
     * ## harmony.breakpoint()
     * Fetch the current breakpoint.
     * @return {Number}
     * @see breakpoint-watcher.js
     */
    breakpoint: watcher.current,
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
     * ## harmony.defineSlot(config)
     * Create a new adSlot in the page.
     * @see actions/define-slot.js
     */
    defineSlot: require('./actions/define-slot.js'),
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
     * ### harmony.show.slot(name)
     * ### harmony.show.group(name)
     * Show a slot or group of slots.
     * @see actions/show.js
     */
    show: require('./actions/show.js'),
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
     * ## harmony.on(name, callback)
     * ## harmony.one(name, callback)
     * ## harmony.off(name)
     * ## harmony.trigger(name)
     * Exposes event handling at the system level.
     * @see event-handler.js
     */
    Eventable()
);
