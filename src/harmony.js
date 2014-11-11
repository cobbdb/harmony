/**
 * # Harmony
 * ### ***DFP JavaScript API Helper***
 * @param {Object} [opts] System level options.
 * @param {Boolean} [opts.jitLoad] True if using Just-In-Time loading.
 * @param {Boolean} [opts.forceLog] True to force Lumberjack logging enabled.
 * @return {Object} Instance of Harmony.
 */
var log, slots, breakpoints, jitLoad;

window.Harmony = function (opts) {
    opts = opts || {};
    jitLoad = opts.jitLoad || false;
    /**
     * ## harmony.slot(name)
     * Safely fetch an existing ad slot or a mock slot if slot was not found.
     * @param {String} name Name of the ad slot.
     * @return {Object} The ad slot or a mock ad slot.
     */
    slots = function (name) {
        if (name in slots) {
            return slots[name];
        }
        return {
            on: util.noop,
            setTargeting: util.noop
        };
    };
    /**
     * ## harmony.breakpoint(name)
     * Safely fetch an existing breakpoint.
     * @param {String} name Name of the ad slot.
     * @return {Object} The breakpoint array or empty if breakpoint
     * was not found.
     */
    breakpoints = function (name) {
        if (name in breakpoints) {
            return breakpoints[name];
        }
        return [];
    };

    log = Lumberjack(opts.forceLog);
    log('init', 'Harmony defined');

    return {
        /**
         * ## harmony.load(opts)
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
         * @see adslot.js
         */
        load: function (opts) {
            // Generate all the ad slots.
            var n, i, slot, setup, conf, len,
                pubads = googletag.pubads();

            opts = opts || {};
            conf = opts.slots || [];
            len = conf.length;

            log('load', 'Generating ad slots.');
            for (i = 0; i < len; i += 1) {
                try {
                    setup = util.scrubSlot(conf[i]);
                    slot = AdSlot(pubads, setup);
                    slots[setup.name] = slot;
                    breakpoints[setup.breakpoint] = breakpoints[setup.breakpoint] || [];
                    breakpoints[setup.breakpoint].push(slot);
                } catch (err) {
                    log('error', {
                        type: 'load() error',
                        id: conf[i].id,
                        name: conf[i].name,
                        conf: conf[i],
                        msg: err.message
                    });
                }
            }

            // Assign the system targeting.
            log('load', 'Applying pubads targeting.');
            conf = opts.targeting;
            for (n in conf) {
                setup = conf[n];
                log('load', '- ' + n + ' = ' + setup);
                pubads.setTargeting(n, setup);
            }

            log('load', 'Harmony config loaded.');
        },
        // ## harmony.log
        // Instance of Lumberjack populated with Harmony's data.
        log: log,
        // ## harmony.slot.&lt;name&gt;
        // Directly access a specific ad slot in the page.
        slot: slots,
        // ## harmony.breakpoint.&lt;name&gt;
        // Directly access the set of ads at a specific breakpoint.
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
            try {
                var pubads = googletag.pubads(),
                    slot = AdSlot(
                        pubads,
                        util.scrubSlot(opts)
                    );
                slots[opts.name] = slot;
                breakpoints[opts.breakpoint] = breakpoints[opts.breakpoint] || [];
                breakpoints[opts.breakpoint].push(slot);
            } catch (err) {
                log('error', {
                    type: 'defineSlot() error',
                    id: opts.id,
                    name: opts.name,
                    conf: opts,
                    msg: err.message
                });
            }
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
                log('show', 'Showing ads at breakpoint ' + bp);
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
                if (jitLoad) {
                    return;
                }
                log('show', 'Showing ad at slot ' + name);
                try {
                    id = slots[name].divId;
                    googletag.display(id);
                    document.getElementById(id).style.display = 'block';
                } catch (err) {
                    log('error', {
                        msg: 'Failed to show slot ' + name,
                        err: err
                    });
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
                log('hide', 'Hiding ads at breakpoint ' + bp);
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
                if (jitLoad) {
                    return;
                }
                log('hide', 'Hiding ad at slot ' + name);
                try {
                    id = slots[name].divId;
                    document.getElementById(id).style.display = 'none';
                } catch (err) {
                    log('error', {
                        msg: 'Failed to hide slot ' + name,
                        err: err
                    });
                }
            }
        }
    };
};
