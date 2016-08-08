/**
 * # Harmony
 * ### ***Simplify your DFP business logic.***
 * View this <a href="https://github.com/cobbdb/harmony">project on GitHub</a>.
 */

var log = require('./modules/log.js'),
    slots = require('./modules/slot-factory.js'),
    groups = require('./modules/group-factory.js'),
    EventHandler = require('./types/event-handler.js'),
    events = EventHandler(),
    watcher = require('./modules/breakpoint-watcher.js'),
    googletag = require('./modules/googletag.js');

/**
 * ## harmony.on('breakpoint/update', callback)
 * @param {function(number)} callback Called on new breakpoint.
 * @see EventHandler
 */
watcher.on('update', function (bp) {
    events.trigger('breakpoint/update', bp);
});

/**
 * ## harmony.on('slotRenderEnded', callback)
 * @param {function(Object)} callback Called each time any ad call completes.
 * @see EventHandler
 * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
 */
googletag.cmd.push(function () {
    googletag.pubads().addEventListener('slotRenderEnded', function (event) {
        events.trigger('slotRenderEnded', event);
    });
});

/**
 * ## harmony
 * @type {Object}
 */
module.exports = {
    /**
     * ## harmony.on(name, callback)
     * @param {string} name Event name.
     * @param {function(?)} callback
     * @see EventHandler
     */
    on: events.on,
    /**
     * ## harmony.one(name, callback)
     * @param {string} name Event name.
     * @param {function(?)} callback
     * @see EventHandler
     */
    one: events.one,
    /**
     * ## harmony.off([name])
     * @param {string} [name] Event name or blank to unbind all events.
     * @see EventHandler
     */
    off: events.off,
    /**
     * ## harmony.trigger(name, [data])
     * @param {string} name Event name.
     * @param {*} [callback] data Data passed to each event callback.
     * @see EventHandler
     */
    trigger: events.trigger,
    /**
     * ## harmony.version
     * @type {string}
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
     * @param {number|number[]} set Breakpoints in pixels.
     * @see BreakpointWatcher
     */
    addBreakpoints: watcher.add,
    /**
     * ## harmony.getBreakpoints()
     * Fetch the list of breakpoints already loaded into the system.
     * @return {?number[]}
     * @see BreakpointWatcher
     */
    getBreakpoints: watcher.getAll,
    /**
     * ## harmony.breakpoint()
     * Fetch the current breakpoint.
     * @return {?number}
     * @see BreakpointWatcher
     */
    breakpoint: watcher.current,
    /**
     * ## harmony.log
     * Instance of Lumberjack populated with Harmony's data.
     * @see modules/log.js
     */
    log: log,
    /**
     * ## harmony.slot(name)
     * Safely fetch an existing ad slot or a mock slot if slot was not found.
     * @param {string} name Name of the ad slot.
     * @return {!(Slot|MockSlot)}
     * @see SlotFactory
     */
    slot: slots.get,
    /**
     * ## harmony.group(name)
     * Fetch a slot group by name.
     * @param {string} name Name of the slot group.
     * @return {!Group} Collection of 0 or more ad slots.
     * @see GroupFactory
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
    show: require('./actions/show.js')
};
