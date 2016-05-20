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
