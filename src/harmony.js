/**
 * # Harmony
 * ### ***DFP JavaScript API Helper***
 * @param {Object} [opts] System level options.
 * @param {Boolean} [opts.jitLoad] True if using Just-In-Time loading.
 * @return {Object} Instance of Harmony.
 */
window.Harmony = function (opts) {
    opts = opts || {};
    var jitLoad = opts.jitLoad || false;
    var slots = {};
    var breakpoints = {};

    log('event', 'Harmony defined');

    return {
        /**
         * ## harmony.load
         * Load a block of configuration.
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
         * @see v2/adslot.js
         */
        load: function (opts) {
            // Generate all the ad slots.
            log('event', 'Generating ad slots.');
            var i, slot, setup;
            var conf = opts.slots;
            var len = conf.length;
            var pubads = googletag.pubads();
            for (i = 0; i < len; i += 1) {
                setup = conf[i];
                slot = AdSlot(pubads, setup);
                slots[setup.name] = slot;
                breakpoints[setup.breakpoint] = breakpoints[setup.breakpoint] || [];
                breakpoints[setup.breakpoint].push(slot);
            }

            // Assign the system targeting.
            log('event', 'Applying pubads targeting.');
            conf = opts.targeting;
            for (i in conf) {
                setup = conf[i];
                log('event', '- ' + i + ' = ' + setup);
                pubads.setTargeting(i, setup);
            }

            log('event', 'Harmony config loaded.');
        },
        // ## harmony.log
        // Instance of Lumberjack populated with Harmony's data.
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
            var pubads = googletag.pubads();
            var slot = AdSlot(pubads, opts);
            slots[opts.name] = slot;
            breakpoints[opts.breakpoint] = breakpoints[opts.breakpoint] || [];
            breakpoints[opts.breakpoint].push(slot);
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
                var i, len, id, elem;
                // Do nothing when jitLoading.
                if (jitLoad) {
                    return;
                }
                log('event', 'Showing ads at breakpoint ' + bp);
                try {
                    len = breakpoints[bp].length;
                    for (i = 0; i < len; i += 1) {
                        id = breakpoints[bp][i].divId;
                        googletag.display(id);
                        elem = document.getElementById(id);
                        if (elem) {
                            elem.style.display = 'block';
                        }
                    }
                } catch (err) {
                    log('error', {
                        msg: 'Failed to show breakpoint ' + bp,
                        err: err
                    });
                }
            },
            /**
             * ### harmony.show.slot
             * @param {String} name
             * Show a single ad slot.
             */
            slot: function (name) {
                var id;
                if (!jitLoad) {
                    log('event', 'Showing ad at slot ' + name);
                    id = slots[name].divId;
                    googletag.display(id);
                    document.getElementById(id).style.display = 'block';
                }
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
                var i, len, id, elem;
                if (jitLoad) {
                    return;
                }
                log('event', 'Hiding ads at breakpoint ' + bp);
                try {
                    len = breakpoints[bp].length;
                    for (i = 0; i < len; i += 1) {
                        id = breakpoints[bp][i].divId;
                        elem = document.getElementById(id);
                        if (elem) {
                            elem.style.display = 'none';
                        }
                    }
                } catch (err) {
                    log('error', {
                        msg: 'Failed to hide breakpoint ' + bp,
                        err: err
                    });
                }
            },
            /**
             * ### harmony.hide.slot
             * @param {String} name
             * Hides a single ad slot.
             */
            slot: function (name) {
                var id;
                if (!jitLoad) {
                    log('event', 'Hiding ad at slot ' + name);
                    id = slots[name].divId;
                    document.getElementById(id).style.display = 'none';
                }
            }
        }
    };
};
