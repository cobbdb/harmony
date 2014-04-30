/**
 * # Harmony
 * ### ***DFP JavaScript API Helper***
 * This constructor will self destruct after calling. There should only ever
 * be one instance of Harmony in existance at any time.
 * @param {Object} opts
 * @param {Object} opts.targeting Key/value targeting pairs.
 * @param {Array} opts.slots List of ad slot information.
 * @param {Object} opts.slots.i Slot options object.
 * @param {String} opts.slots.i.name Slot name, ex) RP01
 * @param {String} opts.slots.i.id Slot's div id, ex) ad-div-RP01
 * @param {Array} opts.slots.i.sizes One or many 2D arrays, ex) [300, 250]
 * @param {String} opts.slots.i.adunit Full ad unit code.
 * @param {Object} [opts.slots.i.targeting] Slot-specific targeting.
 * @param {Array} [opts.slots.i.mapping] Size mapping.
 * @param {Boolean} [opts.slots.i.companion] True if companion ad.
 * @param {String} [opts.slots.i.breakpoint] Display point, ex) 0px-infinity
 * @param {Boolean} [opts.slots.i.interstitial] True if out-of-page ad.
 * @param {Function} [opts.slots.i.callback] Called on dfp's slotRenderEnded.
 * @return {Object} Harmony instance.
 */
window.Harmony = function (opts) {
    var slots = {};
    var breakpoints = {};
    googletag = googletag || {
        cmd: []
    };

    /**
     * ### Initial system startup.
     * @see v2/adslot.js
     */
    googletag.cmd.push(function () {
        // Generate all the ad slots.
        var i, slot, setup;
        var conf = opts.slots;
        var pubads = googletag.pubads();
        for (i = 0; i < conf; i += 1) {
            setup = conf[i];
            slot = AdSlot(pubads, setup);
            slots[setup.name] = slot;
            // Default to breakpoint undefined if not set.
            breakpoints[setup.breakpoint] = breakpoints[setup.breakpoint] || [];
            breakpoints[setup.breakpoint].push(slot);
        }

        // Assign the system targeting.
        log('Applying pubads targeting.');
        conf = opts.targeting;
        for (i in conf) {
            setup = conf[i];
            log('- ' + i + ' = ' + setup);
            pubads.setTargeting(i, setup);
        }
    });

    // Create the new harmony instance.
    var instance = {
        /**
         * ## harmony.log
         * Debug log tool intended for developers only.
         * @see v2/log.js
         */
        log: log,
        // ## harmony.slot.&lt;name&gt;
        // Access a specific ad slot in the page.
        slot: slots,
        // ## harmony.breakpoint.&lt;name&gt;
        // Access the set of ads at a specific breakpoint.
        breakpoint: breakpoints,
        /**
         * ## harmony.defineSlot
         * Create a new adSlot in the page.
         * @param {Object} opts Options object.
         * @param {String} opts.name Slot name, ex) RP01
         * @param {String} opts.id Slot's div id, ex) ad-div-RP01
         * @param {Array} opts.sizes One or many 2D arrays, ex) [300, 250]
         * @param {String} opts.adunit Full ad unit code.
         * @param {Object} [opts.targeting] Slot-specific targeting.
         * @param {Array} [opts.mapping] Size mapping.
         * @param {Boolean} [opts.companion] True if companion ad.
         * @param {String} [opts.breakpoint] Display point, ex) 0px-infinity
         * @param {Boolean} [opts.interstitial] True if out-of-page ad.
         * @param {Function} [opts.callback] Called on dfp's slotRenderEnded.
         * @see v2/adslot.js
         */
        defineSlot: function (opts) {
            googletag.cmd.push(function () {
                var pubads = googletag.pubads();
                var slot = AdSlot(pubads, opts);
                slots[opts.name] = slot;
                breakpoints[opts.breakpoint] = breakpoints[opts.breakpoint] || [];
                breakpoints[opts.breakpoint].push(slot);
            });
        },
        /**
         * ## harmony.show
         * Showing an ad means setting style display:block and
         * calling ```googletag.display()```.
         */
        show: {
            /**
             * ### harmony.show.breakpoint
             * @param {String} bp
             * Show all ads at a breakpoint.
             */
            breakpoint: function (bp) {
                googletag.cmd.push(function () {
                    var i, len, id;
                    len = breakpoints[bp].length;
                    log('Showing ' + len + ' ads at breakpoint ' + bp);
                    for (i = 0; i < len; i += 1) {
                        id = breakpoints[bp][i].div_id;
                        googletag.display(id);
                        document.getElementById(id).style.display = 'block';
                    }
                });
            },
            /**
             * ### harmony.show.slot
             * @param {String} name
             * Show a single ad slot.
             */
            slot: function (name) {
                googletag.cmd.push(function () {
                    log('Showing ad at slot ' + name);
                    var id = slots[name].div_id;
                    googletag.display(id);
                    document.getElementById(id).style.display = 'block';
                });
            }
        },
        /**
         * ## harmony.hide
         * Hiding an ad means setting style display:none.
         */
        hide: {
            /**
             * ### harmony.hide.breakpoint
             * @param {String} bp
             * Hides all the ads at a breakpoint.
             */
            breakpoint: function (bp) {
                var i, len, id;
                len = breakpoints[bp].length;
                log('Hiding ' + len + ' ads at breakpoint ' + bp);
                for (i = 0; i < len; i += 1) {
                    id = breakpoints[bp][i].div_id;
                    document.getElementById(id).style.display = 'none';
                }
            },
            /**
             * ### harmony.hide.slot
             * @param {String} name
             * Hides a single ad slot.
             */
            slot: function (name) {
                log('Hiding ad at slot ' + name);
                var id = slots[name].div_id;
                document.getElementById(id).style.display = 'none';
            }
        }
    };

    // Remove constructor from window.
    delete window.Harmony;
    return instance;
};
