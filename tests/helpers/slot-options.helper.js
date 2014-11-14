var $ = require('jquery'),
    BpSet = require('../../src/bpset.js'),
    SlotSet = require('../../src/slotset.js');

/**
 * Reset the collections of slots and breakpoints.
 */
afterEach(function () {
    BpSet.clear();
    SlotSet.clear();
});

/**
 * Generic adslot construction options.
 */
module.exports = function (opts) {
    // Reset the model.
    return $.extend({
        name: '',
        id: '',
        sizes: [],
        adunit: '',
        targeting: {},
        mapping: [],
        companion: false,
        breakpoint: '',
        interstitial: false,
        callback: function () {}
    }, opts);
};
