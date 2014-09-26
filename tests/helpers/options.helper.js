/**
 * Generic adslot construction options.
 */
Options = function (opts) {
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
