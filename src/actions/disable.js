/**
 * # Disable Action
 * Disable a single slot or group of slots.
 */

var SlotFactory = require('../modules/slot-factory.js'),
    GroupFactory = require('../modules/group-factory.js'),
    events = require('../modules/master-event-handler.js'),
    googletag = require('../modules/googletag.js');

/**
 * ## harmony.disable
 */
module.exports = {
    /**
     * ### slot(name)
     * Marks this slot as ineligible to make ad calls.
     * @param {string} name
     */
    slot: function (name) {
        SlotFactory.get(name).enabled = false;
    },
    /**
     * ### group(name)
     * Marks each slot in this group as ineligible to make ad calls.
     * @param {string} name
     */
    group: function (name) {
        var group = GroupFactory.create(name);
        group.forEach(function (slot) {
            slot.enabled = false;
        });
    },
    /**
     * ## initialLoad([restoreAfterSRM])
     * @param {?boolean} restoreAfterSRM True to reenable initial load after the
     * SRM call returns.
     * Disable initial slot load, but offer the option to reenable. This is a
     * **massive** oversight by the GPT library. Hopefully one day I can delete
     * this code.
     */
    initialLoad: function (restore) {
        googletag.pubads().disableInitialLoad();
        if (restore) {
            events.one('slotRenderEnded', function () {
                module.exports.initialLoadRestored = true;
            });
        }
    },
    /**
     * ## initialLoadRestored
     * @type {boolean} True when expecting a single `show` call to display ads
     * after the SRM ad call has resolved and pubads is set to `disableInitialLoad`.
     */
    initialLoadRestored: false
};
