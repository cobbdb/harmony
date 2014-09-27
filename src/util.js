/**
 * # Utilities
 */
var util = {
    // Counter for ensuring unique ad slots.
    slotCount: 0,
    /**
     * ## util.noop()
     * Simple no-op.
     */
    noop: function () {},
    /**
     * ## util.scrubSlot()
     * Ensures a slot's name and id are unique in the page. If a
     * container has content, it is assumed that an ad call has already
     * been made.
     * @param {Object} slot Configuration for a single ad slot.
     */
    scrubSlot: function (slot) {
        var suffix,
            el = document.getElementById(slot.id);
        // Only do work if there are multiple instances.
        if (slot.name in slots) {
            if (el && el.innerHTML) {
                // Ad call has already been made for this element,
                // so update its id and query again for next div.
                this.slotCount += 1;
                suffix = '-' + this.slotCount;
                el.id += suffix;
                slots[slot.name].divId = el.id;
                slots[slot.name + suffix] = slots[slot.name];
                el = document.getElementById(slot.id);
            }
            if (el) {
                this.slotCount += 1;
                suffix = '-' + this.slotCount;
                el.id += suffix;
                slot.id += suffix;
                slot.name += suffix;
            }
        }
        if (!el) {
            // Log error if slot is not in the dom.
            log('error', {
                id: slot.id,
                msg: 'Ad slot container was not found in the DOM.'
            });
        }
        return slot;
    }
};
