/**
 * # Harmony
 * ### ***DFP JavaScript API Helper***
 */

var Util = require('./util.js'),
    AdSlot = require('./adslot.js'),
    log = require('./log.js'),
    slots = require('./slotset.js'),
    breakpoints = require('./bpset.js');

/**
 * ## Harmony()
 * Create a new instance of Harmony.
 * @param {Boolean} [opts.forceLog] True to force Lumberjack logging enabled.
 * @return {Object} Instance of Harmony.
 */
module.exports = function (opts) {
    opts = opts || {};
    if (opts.forceLog) {    
        log.enable();
    }
    log('init', 'Harmony defined.');

    return {
        /**
         * ## harmony.load(opts)
         * Load a block of configuration.
         * @param {Object} opts.targeting System-level targeting.
         * @param {Array} opts.slots List of ad slot information.
         * @param {Object} opts.slots.i Slot options object.
         * @param {String} opts.slots.i.name Slot name, ex) RP01
         * @param {String} opts.slots.i.id Slot's div id, ex) ad-div-RP01
         * @param {Array} opts.slots.i.sizes One or many 2D arrays, ex) [300, 250]
         * @param {String} opts.slots.i.adunit Full ad unit code.
         * @param {Object} [opts.slots.i.targeting] Slot-level targeting.
         * @param {Array} [opts.slots.i.mapping] Size mapping.
         * @param {Boolean} [opts.slots.i.companion] True if companion ad.
         * @param {String} [opts.slots.i.breakpoint] Display point, ex) 0px-infinity
         * @param {Boolean} [opts.slots.i.interstitial] True if out-of-page ad.
         * @param {Function} [opts.slots.i.callback] Called on dfp's slotRenderEnded.
         * @see adslot.js
         */
        load: function (opts) {
            var pubads = global.googletag.pubads();

            opts = opts || {};
            opts.slots = opts.slots || [];

            // Generate the ad slots.
            var i, slot, conf,
                len = opts.slots.length;
            log('load', 'Generating ad slots.');
            for (i = 0; i < len; i += 1) {
                conf = opts.slots[i];
                try {
                    slot = AdSlot(
                        pubads,
                        Util.scrubConf(conf)
                    );
                    slots.add(slot);
                    breakpoints.add(slot.breakpoint, slot);
                } catch (err) {
                    log('error', {
                        type: 'load() error',
                        conf: conf,
                        err: err
                    });
                }
            }

            // Assign the system targeting.
            var key, value,
                targeting = opts.targeting || {};
            log('load', 'Applying pubads targeting.');
            for (key in targeting) {
                value = targeting[key];
                log('load', '- ' + key + ' = ' + value);
                pubads.setTargeting(key, value);
            }

            log('load', 'Harmony config loaded.');
        },
        // ## harmony.log
        // Instance of Lumberjack populated with Harmony's data.
        log: log,
        /**
         * ## harmony.slot(name)
         * Safely fetch an existing ad slot or a mock slot if slot was not found.
         * @param {String} name Name of the ad slot.
         * @return {Object} The ad slot or a mock ad slot.
         */
        slot: slots.get,
        /**
         * ## harmony.hasSlot(name)
         * Check if a slot has already been loaded into Harmony.
         * @param {String} name Name of the ad slot.
         * @return {Boolean} True if the slot has already been loaded.
         */
        hasSlot: slots.has,
        /**
         * ## harmony.breakpoint(name)
         * Safely fetch an existing ad slot or a mock slot if slot was not found.
         * @param {String} name Name of the ad slot.
         * @return {Object} The ad slot or a mock ad slot.
         */
        breakpoint: breakpoints.get,
        /**
         * ## harmony.defineSlot
         * Create a new adSlot in the page.
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
            var slot;
            try {
                slot = AdSlot(
                    global.googletag.pubads(),
                    Util.scrubConf(opts)
                );
                slots.add(slot);
                breakpoints.add(opts.breakpoint, slot);
            } catch (err) {
                log('error', {
                    type: 'defineSlot() error',
                    conf: opts,
                    err: err
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
            breakpoint: function (name) {
                var i, slot,
                    set = breakpoints.get(name),
                    len = set.length;
                log('show', 'Showing ads at breakpoint ' + name);
                try {
                    for (i = 0; i < len; i += 1) {
                        slot = set[i];
                        global.googletag.display(slot.divId);
                        slot.div.style.display = 'block';
                    }
                } catch (err) {
                    log('error', {
                        msg: 'Failed to show breakpoint ' + name,
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
                var slot;
                log('show', 'Showing ad at slot ' + name);
                try {
                    slot = slots.get(name);
                    global.googletag.display(slot.divId);
                    slot.div.style.display = 'block';
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
             * ### harmony.hide.breakpoint(name)
             * @param {String} name
             * Hides all the ads at a breakpoint.
             */
            breakpoint: function (name) {
                var i,
                    set = breakpoints.get(name),
                    len = set.length;
                log('hide', 'Hiding ads at breakpoint ' + name);
                for (i = 0; i < len; i += 1) {
                    set[i].div.style.display = 'none';
                }
            },
            /**
             * ### harmony.hide.slot(name)
             * @param {String} name
             * Hides a single ad slot.
             */
            slot: function (name) {
                log('hide', 'Hiding ad at slot ' + name);
                slots.get(name).div.style.display = 'none';
            }
        }
    };
};
