// Counter for ensuring unique ad slots.
var slotCount = 0;

/**
 * # Utilities
 */
module.exports = {
    /**
     * ## Util.noop()
     * Simple no-op.
     */
    noop: function () {},
    /**
     * ## Util.scrubSlot()
     * Ensures a slot's name and id are unique in the page. If a
     * container has content, it is assumed that an ad call has already
     * been made.
     * @param {Object} slot Configuration for a single ad slot.
     * @param {Object} slots Collection of ad slots by name:slot pairs.
     */
    scrubSlot: function (slot, slots) {
        var suffix,
            el = document.getElementById(slot.id);
        // Only do work if there are multiple instances.
        if (slot.name in slots) {
            if (el && el.innerHTML) {
                // Ad call has already been made for this element,
                // so update its id and query again for next div.
                slotCount += 1;
                suffix = '-' + slotCount;
                el.id += suffix;
                slots[slot.name].divId = el.id;
                slots[slot.name + suffix] = slots[slot.name];
                el = document.getElementById(slot.id);
            }
            if (el) {
                slotCount += 1;
                suffix = '-' + slotCount;
                el.id += suffix;
                slot.id += suffix;
                slot.name += suffix;
            }
        }
        if (!el) {
            throw Error('Ad slot container was not found in the DOM.');
        }
        return slot;
    }
};
