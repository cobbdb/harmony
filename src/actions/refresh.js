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
    var i, len, slot, name,
        refreshSet = [],
        displaySet = [],
        map = slots.getAll();
    for (name in map) {
        slot = map[name];
        if (slot.enabled) {
            if (slot.active) {
                refreshSet.push(slot);
            } else {
                displaySet.push(slot);
            }
        }
    }

    // Refresh the already active slots.
    global.googletag.pubads().refresh(refreshSet);

    // Display the dormant slots.
    len = displaySet.length;
    for (i = 0; i < len; i += 1) {
        slot = displaySet[i];
        slot.active = true;
        global.googletag.display(slot.divId);
    }
};

/**
 * ## harmony.refresh.slot(name)
 * Call ```pubads().refresh()``` on a slot if enabled.
 * @param {String} name
 */
module.exports.slot = function (name) {
    var slot = slots.get(name);
    if (!slot.mock && slot.enabled) {
        if (slot.active) {
            global.googletag.pubads().refresh([slot]);
        } else {
            slot.active = true;
            global.googletag.display(slot.divId);
        }
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
        refreshSet = [],
        displaySet = [];
    for (i = 0; i < len; i += 1) {
        slot = group[i];
        if (slot.enabled) {
            if (slot.active) {
                refreshSet.push(slot);
            } else {
                displaySet.push(slot);
            }
        }
    }

    // Refresh the already active slots.
    global.googletag.pubads().refresh(refreshSet);

    // Display the dormant slots.
    len = displaySet.length;
    for (i = 0; i < len; i += 1) {
        slot = displaySet[i];
        slot.active = true;
        global.googletag.display(slot.divId);
    }
};
