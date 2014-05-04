/**
 * Generic adslot construction options.
 */
Options = function () {
    // Reset the model.
    return {
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
    };
};
