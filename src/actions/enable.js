/**
 * # harmony.enable
 * Enable a single slot or group of slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js');

module.exports = {
    slot: function (name) {
        slots.get(name).enabled = true;
    },
    group: function (name) {
        var i,
            group = groups.get(name),
            len = group.length;
        for (i = 0; i < len; i += 1) {
            group[i].enabled = true;
        }
    }
};
