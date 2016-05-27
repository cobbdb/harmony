/**
 * # Harmony
 * ### ***Simplify your DFP business logic.***
 * View this <a href="https://github.com/cobbdb/harmony">project on GitHub</a>.
 */

var log = require('./log.js'),
    slots = require('./slot-set.js'),
    groups = require('./group-set.js'),
    BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js'),
    watcher = require('./breakpoint-watcher.js');

log('init', 'Harmony defined.');

/**
 * ## harmony
 * @type {BaseClass}
 * @see BaseClass http://cobbdb.github.io/baseclass
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
         * @see <a href="event-handler.js">event-handler.js</a>
         */
        watcher.on('update', function (bp) {
            that.trigger('breakpoint/update', bp);
        });
        /**
         * ## harmony.on('slotRenderEnded', callback)
         * @param {Function} callback Called each time any ad call completes.
         * @see <a href="event-handler.js">event-handler.js</a>
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
     * @see <a href="actions/load.js">actions/load.js</a>
     */
    load: require('./actions/load.js'),
    /**
     * ## harmony.addBreakpoints(set)
     * Add breakpoint values in pixels.
     * @param {Number|Array of Numbers} [set] Breakpoints in pixels.
     * @see <a href="breakpoint-watcher.js">breakpoint-watcher.js</a>
     */
    addBreakpoints: watcher.add,
    /**
     * ## harmony.getBreakpoints()
     * Fetch the list of breakpoints already loaded into the system.
     * @return {ArrayOfNumber}
     * @see <a href="breakpoint-watcher.js">breakpoint-watcher.js</a>
     */
    getBreakpoints: watcher.getAll,
    /**
     * ## harmony.breakpoint()
     * Fetch the current breakpoint.
     * @return {Number}
     * @see <a href="breakpoint-watcher.js">breakpoint-watcher.js</a>
     */
    breakpoint: watcher.current,
    /**
     * ## harmony.log
     * ### harmony.log.enable()
     * Instance of Lumberjack populated with Harmony's data.
     * @see <a href="log.js">log.js</a>
     */
    log: log,
    /**
     * ## harmony.slot(name)
     * Safely fetch an existing ad slot or a mock slot if slot was not found.
     * @param {String} name Name of the ad slot.
     * @return {Object} The ad slot or a mock ad slot.
     * @see <a href="slot-set.js">slot-set.js</a>
     */
    slot: slots.get,
    /**
     * ## harmony.hasSlot(name)
     * Check if a slot has already been loaded into Harmony.
     * @param {String} name Name of the ad slot.
     * @return {Boolean} True if the slot has already been loaded.
     * @see <a href="slot-set.js">slot-set.js</a>
     */
    hasSlot: slots.has,
    /**
     * ## harmony.group(name)
     * Fetch a slot group by name.
     * @param {String} name Name of the slot group.
     * @return {Array} Collection of 0 or more ad slots.
     * @see <a href="group-set.js">group-set.js</a>
     */
    group: groups.get,
    /**
     * ## harmony.defineSlot(config)
     * Create a new adSlot in the page.
     * @see <a href="actions/define-slot.js">actions/define-slot.js</a>
     */
    defineSlot: require('./actions/define-slot.js'),
    /**
     * ## harmony.enable
     * ### harmony.enable.slot(name)
     * ### harmony.enable.group(name)
     * Marks slots as eligible to make ad calls.
     * @see <a href="actions/enable.js">actions/enable.js</a>
     */
    enable: require('./actions/enable.js'),
    /**
     * ## harmony.disable
     * ### harmony.disable.slot(name)
     * ### harmony.disable.group(name)
     * Marks slots as ineligible to make ad calls.
     * @see <a href="actions/disable.js">actions/disable.js</a>
     */
    disable: require('./actions/disable.js'),
    /**
     * ## harmony.refresh
     * ### harmony.refresh.slot(name)
     * ### harmony.refresh.group(name)
     * Refresh a single slot or group of slots.
     * @see <a href="actions/refresh.js">actions/refresh.js</a>
     */
    refresh: require('./actions/refresh.js'),
    /**
     * ## harmony.show
     * ### harmony.show.slot(name)
     * ### harmony.show.group(name)
     * Show a slot or group of slots.
     * @see <a href="actions/show.js">actions/show.js</a>
     */
    show: require('./actions/show.js'),
    /**
     * ## harmony.hide
     * ### harmony.hide.slot(name)
     * ### harmony.hide.group(name)
     * Hide a slot or group of slots.
     * @see <a href="actions/hide.js">actions/hide.js</a>
     */
    hide: require('./actions/hide.js')
}).extend(
    /**
     * ## harmony.on(name, callback)
     * ## harmony.one(name, callback)
     * ## harmony.off(name)
     * ## harmony.trigger(name)
     * Exposes event handling at the system level.
     * @see <a href="event-handler.js">event-handler.js</a>
     */
    Eventable()
);
