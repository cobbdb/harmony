/**
 * # Utilities
 */

var slots = require('./slotset.js');

module.exports = {
    /**
     * ## Util.noop()
     * Simple no-op.
     */
    noop: function () {},
    /**
     * ## Util.slotCount
     * Counter for ensuring unique ad slots.
     */
    slotCount: 0,
    /**
     * ## Util.scrubConf(conf)
     * Ensures a slot's name and id are unique in the page. If a
     * container has content, it is assumed that an ad call has already
     * been made.
     * @param {Object} conf Configuration for a single ad slot.
     * @return {Object} Clean slot configuration.
     */
    scrubConf: function (conf) {
        var suffix, el,
            temp = {
                el: {}
            };

        // Only do work if there are multiple instances.
        if (slots.has(conf.name)) {
            do {
                el = document.getElementById(conf.id);
                if (el) {
                    if (el.innerHTML) {
                        // Slot has already been processed,
                        // so move it aside and query again.
                        temp.el = el;
                        temp.id = el.id;
                        el.id = 'h-temp';
                    } else {
                        this.slotCount += 1;
                        suffix = '-h' + this.slotCount;
                        el.id += suffix;
                        // Restore any existing slot.
                        temp.el.id = temp.id;
                        conf.id = el.id;
                        conf.name += suffix;
                        return conf;
                    }
                }
            } while (el);
            throw Error('Ad slot container was not found in the DOM.');
        }
        return conf;
    }
};
