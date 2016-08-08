/**
 * # Enable Action
 * Enable a single slot or group of slots.
 */

var SlotFactory = require('../modules/slot-factory.js'),
    GroupFactory = require('../modules/group-factory.js');

module.exports = {
    /**
     * ## harmony.enable.slot(name)
     * Marks this slot as eligible to make ad calls.
     * @param {string} name
     */
    slot: function (name) {
        var slot = SlotFactory.get(name);
        if (!slot.mock) {
            slot.enabled = true;
        }
    },
    /**
     * ## harmony.enable.group(name)
     * Marks each slot in this group as eligible to make ad calls.
     * @param {string} name
     */
    group: function (name) {
        var group = GroupFactory.create(name);
        group.forEach(function (slot) {
            slot.enabled = true;
        });
    }
};
