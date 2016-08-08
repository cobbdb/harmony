/**
 * # Enable Action
 * Enable a single slot or group of slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js');

module.exports = {
    /**
     * ## harmony.enable.slot(name)
     * Marks this slot as eligible to make ad calls.
     * @param {string} name
     */
    slot: function (name) {
        slots.get(name).enabled = true;
    },
    /**
     * ## harmony.enable.group(name)
     * Marks each slot in this group as eligible to make ad calls.
     * @param {string} name
     */
    group: function (name) {
        var i,
            group = groups.get(name),
            len = group.length;
        for (i = 0; i < len; i += 1) {
            group[i].enabled = true;
        }
    }
};
