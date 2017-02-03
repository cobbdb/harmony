/**
 * # Harmony
 * ### ***Simplify your DFP business logic.***
 * View this <a href="https://github.com/cobbdb/harmony">project on GitHub</a>.
 */

var log = require('./modules/log.js'),
    SlotFactory = require('./modules/slot-factory.js'),
    GroupFactory = require('./modules/group-factory.js'),
    events = require('./modules/master-event-handler.js'),
    watcher = require('./modules/breakpoint-watcher.js'),
    googletag = require('./modules/googletag.js');

/**
 * ## harmony.on('breakpoint/update', callback)
 * @param {function(number)} callback Called on new breakpoint.
 * @see types/event-handler.js
 * @see modules/breakpoint-watcher.js
 */
watcher.on('update', function (bp) {
    events.trigger('breakpoint/update', bp);
});

googletag.cmd.push(function () {
    /**
     * ## harmony.on('slotRenderEnded', callback)
     * @param {!function(googletag.events.SlotRenderEndedEvent)} callback Called each time any ad call completes.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
     */
    googletag.pubads().addEventListener('slotRenderEnded', function (event) {
        events.trigger('slotRenderEnded', event);
    });
    /**
     * ## harmony.on('impressionViewable', callback)
     * @param {!function(googletag.events.ImpressionViewableEvent)} callback Called each time any slot registers a viewed impression.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
     */
    googletag.pubads().addEventListener('impressionViewable', function (event) {
        events.trigger('impressionViewable', event);
    });
});

/**
 * ## harmony
 * @type {Harmony}
 */
module.exports = {
    /**
     * ### on(name, callback)
     * @see types/event-handler.js
     */
    on: events.on,
    /**
     * ### one(name, callback)
     * @see types/event-handler.js
     */
    one: events.one,
    /**
     * ### off([name])
     * @see types/event-handler.js
     */
    off: events.off,
    /**
     * ### trigger(name, [data])
     * @see types/event-handler.js
     */
    trigger: events.trigger,
    /**
     * ### version
     * @type {string}
     */
    version: require('../package.json').version,
    /**
     * ### load()
     * Load bulk configurations into the system.
     * @see actions/load.js
     */
    load: require('./actions/load.js'),
    /**
     * ### addBreakpoints(set)
     * Add breakpoint values in pixels.
     * @param {number[]} set Breakpoints in pixels.
     * @see modules/breakpoint-watcher.js
     */
    addBreakpoints: watcher.add,
    /**
     * ### getBreakpoints()
     * Fetch the list of breakpoints already loaded into the system.
     * @return {?number[]}
     * @see modules/breakpoint-watcher.js
     */
    getBreakpoints: watcher.getAll,
    /**
     * ### breakpoint()
     * Fetch the current breakpoint.
     * @return {?number}
     * @see modules/breakpoint-watcher.js
     */
    breakpoint: watcher.current,
    /**
     * ### log
     * Instance of Lumberjack populated with Harmony's data.
     * @see modules/log.js
     */
    log: log,
    /**
     * ### slot(name)
     * Safely fetch an existing ad slot or a mock slot if slot was not found.
     * @param {string} name Name of the ad slot.
     * @return {!(Slot|MockSlot)}
     * @see modules/slot-factory.js
     */
    slot: SlotFactory.get,
    /**
     * ### group(name)
     * Fetch a slot group by name.
     * @param {string} name Name of the slot group.
     * @return {!Group} Collection of 0 or more ad slots.
     * @see modules/group-factory.js
     */
    group: GroupFactory.create,
    /**
     * ### slots
     * Fetch the master group of all slots.
     * @type {!Group} Collection of all slots in the system.
     * @see modules/master-group.js
     */
    slots: require('./modules/master-group.js'),
    /**
     * ### defineSlot(config)
     * Create a new adSlot in the page.
     * @see modules/slot-factory.js
     */
    defineSlot: SlotFactory.create,
    /**
     * ### enable
     * #### slot(name)
     * #### group(name)
     * Marks slots as eligible to make ad calls.
     * @see actions/enable.js
     */
    enable: require('./actions/enable.js'),
    /**
     * ### disable
     * #### slot(name)
     * #### group(name)
     * Marks slots as ineligible to make ad calls.
     * @see actions/disable.js
     */
    disable: require('./actions/disable.js'),
    /**
     * ### show
     * #### slot(name)
     * #### group(name)
     * Show a slot or group of slots.
     * @see actions/show.js
     */
    show: require('./actions/show.js')
};
