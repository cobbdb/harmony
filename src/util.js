/**
 * # Utilities
 */

var slots = require('./slotset.js'),
    // Counter for ensuring unique ad slots.
    slotCount = 0;

module.exports = {
    /**
     * ## Util.noop()
     * Simple no-op.
     */
    noop: function () {},
    /**
     * ## Util.scrubSlot(conf)
     * Ensures a slot's name and id are unique in the page. If a
     * container has content, it is assumed that an ad call has already
     * been made.
     * @param {Object} conf Configuration for a single ad slot.
     * @return {Object} Clean slot configuration.
     */
    scrubSlot: function (conf) {
        var suffix, slot,
            el = document.getElementById(conf.id);

        // Only do work if there are multiple instances.
        if (slots.has(conf.name)) {
            if (el && el.innerHTML) {
                // Ad call has already been made for this element,
                // so update its id and query again for next div.
                slotCount += 1;
                suffix = '-' + slotCount;
                el.id += suffix;
                slot = slots.get(conf.name);
                slot.divId = el.id;
                slots.add(conf.name + suffix, slot);
                el = document.getElementById(conf.id);
            }
            if (el) {
                slotCount += 1;
                suffix = '-' + slotCount;
                el.id += suffix;
                conf.id += suffix;
                conf.name += suffix;
            }
        }
        if (!el) {
            throw Error('Ad slot container was not found in the DOM.');
        }
        return conf;
    }
};
