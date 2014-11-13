var $ = require('jquery');

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
