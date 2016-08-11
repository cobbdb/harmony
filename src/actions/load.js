/**
 * # Load Action
 */

var watcher = require('../modules/breakpoint-watcher.js'),
    googletag = require('../modules/googletag.js'),
    SlotFactory = require('../modules/slot-factory.js');

module.exports = {
    /**
     * ## load.slots(slots)
     * @param {Slot[]} slots
     * @see modules/slot-factory.js
     */
    slots: function (slots) {
        slots = slots || [];
        slots.forEach(SlotFactory.create);
    },
    /**
     * ## load.targeting(targeting)
     * Set system-level targeting that applies to all Slots.
     * @param {Object<string, string>} targeting
     */
    targeting: function (targeting) {
        var key, pubads = googletag.pubads();
        targeting = targeting || {};
        for (key in targeting) {
            pubads.setTargeting(key, targeting[key]);
        }
    },
    /**
     * ## load.breakpoints(breakpoints)
     * @param {(number|number[])} breakpoints
     */
    breakpoints: function (breakpoints) {
        watcher.add(breakpoints);
    }
};
