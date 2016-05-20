/**
 * # Refresh Action
 * Refresh a single slot or group of slots. Will not
 * make ad calls for disabled slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js');

/**
 * ## harmony.refresh()
 * Call ```pubads().refresh()``` on all enabled slots in the page.
 */
module.exports = function () {
    var slot, name,
        set = [],
        map = slots.getAll();
    for (name in map) {
        slot = map[name];
        if (slot.enabled) {
            set.push(slot);
        }
    }
    global.googletag.pubads().refresh(set);
};

/**
 * ## harmony.refresh.slot(name)
 * Call ```pubads().refresh()``` on a slot if enabled.
 * @param {String} name
 */
module.exports.slot = function (name) {
    var slot = slots.get(name);
    if (!slot.mock && slot.enabled) {
        global.googletag.pubads().refresh([slot]);
    }
};

/**
 * ## harmony.refresh.group(name)
 * Call ```pubads().refresh()``` on a group of slots if enabled.
 * @param {String} name
 */
module.exports.group = function (name) {
    var i, slot,
        group = groups.get(name),
        len = group.length,
        set = [];
    for (i = 0; i < len; i += 1) {
        slot = group[i];
        if (slot.enabled) {
            set.push(slot);
        }
    }
    global.googletag.pubads().refresh(set);
};
