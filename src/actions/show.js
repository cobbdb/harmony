/**
 * # Show Action
 * Show a slot or group of slots.
 */

var slots = require('../slot-set.js'),
    groups = require('../group-set.js'),
    log = require('../log.js');

/**
 * ## harmony.show
 * Showing a slot means setting style ```display:block``` and
 * calling ```googletag.display()```. Will not call
 * ```googletag.display()``` on disabled slots.
 */
module.exports = {
    /**
     * ### harmony.show.group(name)
     * Show all ads in a slot group.
     * @param {String} name
     */
    group: function (name) {
        var i, slot, el,
            set = groups.get(name),
            len = set.length;
        log('show', {
            msg: 'Showing ads in group',
            group: name
        });
        try {
            for (i = 0; i < len; i += 1) {
                slot = set[i];
                slot.tsCalled = global.Date.now();

                // Only make ad call if slot is enabled.
                if (slot.enabled) {
                    slot.active = true;
                    global.googletag.display(slot.divId);
                }

                el = document.getElementById(slot.divId);
                if (el) {
                    el.style.display = 'block';
                } else {
                    log('error', {
                        msg: 'Failed to show slot for group',
                        group: name,
                        reason: 'Slot was missing from the DOM',
                        slot: slot
                    });
                }
            }
        } catch (err) {
            log('error', {
                msg: 'Failed to show group',
                group: name,
                err: err
            });
        }
    },
    /**
     * ### harmony.show.slot(name)
     * Show a single ad slot.
     * @param {String} name
     */
    slot: function (name) {
        var slot, el;
        log('show', {
            msg: 'Showing slot',
            name: name
        });
        try {
            slot = slots.get(name);
            slot.tsCalled = global.Date.now();

            // Only make ad call if slot is enabled.
            if (slot.enabled) {
                slot.active = true;
                global.googletag.display(slot.divId);
            }

            el = document.getElementById(slot.divId);
            el.style.display = 'block';
        } catch (err) {
            log('error', {
                msg: 'Failed to show slot',
                name: name,
                err: err
            });
        }
    }
};
