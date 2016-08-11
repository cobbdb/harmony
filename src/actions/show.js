/**
 * # Show Action
 * Show a slot or group of slots.
 */

var SlotFactory = require('../modules/slot-factory.js'),
    GroupFactory = require('../modules/group-factory.js'),
    masterGroup = require('../modules/master-group.js'),
    log = require('../modules/log.js'),
    enableServices = require('../util/enable-services.js'),
    googletag = require('../modules/googletag.js');

/**
 * Activate the slot and make ad call. Refresh if slot is already active.
 * @private
 * @param {Slot} slot
 */
function show(slot) {
    if (slot.enabled) {
        if (slot.active) {
            googletag.pubads().refresh([slot.gpt]);
        } else {
            slot.activate();
            googletag.display(slot.id);
        }
    }
}

/**
 * ## harmony.show
 * Activate Slots and make their ad calls. If a slot has already been
 * activated, then calls to `show` will refresh its contents.
 */
module.exports = {
    /**
     * ### all()
     * *Danger Zone* Show all slots in the page.
     */
    all: function () {
        enableServices();
        masterGroup.forEach(show);
    },
    /**
     * ### group(name)
     * Show all ads in a group.
     * @param {string} name
     */
    group: function (name) {
        var group = GroupFactory.create(name);
        enableServices();
        group.forEach(show);
    },
    /**
     * ### slot(name)
     * Show a single ad slot.
     * @param {string} name
     */
    slot: function (name) {
        var slot = SlotFactory.get(name);
        enableServices();
        show(slot);
    }
};
