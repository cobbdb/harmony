/**
 * # Utilities
 */

module.exports = {
    /**
     * ## Util.noop()
     * Simple no-op.
     * @type {Function}
     */
    noop: function () {},
    /**
     * ## Util.slotCount
     * Counter for ensuring unique ad slots.
     * @type {Number}
     */
    slotCount: 0,
    /**
     * ## Util.nextSlotId()
     * Generate the next available slot id.
     * @return {Number}
     */
    nextSlotId: function () {
        this.slotCount += 1;
        return this.slotCount;
    },
    /**
     * ## Util.scrubConf(conf)
     * Ensures a slot's name and id are unique in the page. If a
     * container has content, it is assumed that an ad call has already
     * been made.
     * @param {Object} conf Configuration for a single ad slot.
     * @return {Object} Clean slot configuration.
     */
    scrubConf: function (conf) {
        var el = global.document.getElementById(conf.id),
            slots = require('./slot-set.js'),
            newId;
        if (el) {
            newId = this.nextSlotId();
            conf.id = el.id = 'h-ad-' + newId;
            if (slots.has(conf.name)) {
                conf.name += '-h' + newId;
            }
            return conf;
        }
        throw Error('Ad slot container was not found in the DOM #' + conf.id);
    }
};
