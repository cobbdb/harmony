/**
 * # Show Action
 * Show a slot or group of slots.
 */

var SlotFactory = require('../modules/slot-factory.js'),
    GroupFactory = require('../modules/group-factory.js'),
    log = require('../modules/log.js'),
    enableServices = require('../util/enable-services.js'),
    googletag = require('../modules/googletag.js');

/**
 * Record metrics, activate the slot, and make ad call.
 * @private
 * @param {Slot} slot
 */
function show(slot) {
    if (slot.enabled) {
        slot.activate();
        googletag.display(slot.id);
    }
}

/**
 * ## harmony.show
 * Activate Slots and make their ad calls.
 */
module.exports = {
    /**
     * ### harmony.show.group(name)
     * Show all ads in a group.
     * @param {string} name
     */
    group: function (name) {
        var group = GroupFactory.create(name);
        enableServices();
        group.forEach(show);
    },
    /**
     * ### harmony.show.slot(name)
     * Show a single ad slot.
     * @param {string} name
     */
    slot: function (name) {
        var slot = SlotFactory.create(name);
        enableServices();
        show(slot);
    }
};
