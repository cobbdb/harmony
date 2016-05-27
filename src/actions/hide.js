/**
 * # Hide Action
 * Hide a slot or group of slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js'),
    log = require('../log.js');

/**
 * ## harmony.hide
 * Hiding an ad means setting style ```display:none```.
 */
module.exports = {
    /**
     * ### harmony.hide.group(name)
     * Hides all the ads in a slot group.
     * @param {String} name
     */
    group: function (name) {
        var i, el,
            set = groups.get(name),
            len = set.length;
        log('hide', 'Hiding ads in group ' + name);
        for (i = 0; i < len; i += 1) {
            el = document.getElementById(set[i].divId);
            if (el) {
                el.style.display = 'none';
            } else {
                log('error', {
                    msg: 'Failed to hide slot in group',
                    group: name,
                    reason: 'Slot was missing from the DOM',
                    id: set[i].divId
                });
            }
        }
    },
    /**
     * ### harmony.hide.slot(name)
     * Hides a single ad slot.
     * @param {String} name
     */
    slot: function (name) {
        var el,
            slot = slots.get(name);
        log('hide', {
            msg: 'Hiding slot',
            name: name
        });
        try {
            el = document.getElementById(slot.divId);
            el.style.display = 'none';
        } catch (err) {
            log('error', {
                msg: 'Failed to hide slot',
                name: name,
                err: err
            });
        }
    }
};
