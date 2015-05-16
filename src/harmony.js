/**
 * # Harmony
 * ### ***DFP JavaScript API Helper***
 */

var Util = require('./util.js'),
    AdSlot = require('./adslot.js'),
    log = require('./log.js'),
    slots = require('./slotset.js'),
    breakpoints = require('./bpset.js'),
    BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js');

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

    return BaseClass({
        /**
         * ## harmony.load(opts)
         * Load a block of configuration.
         * @param {Object} [opts.targeting] System-level targeting.
         * @param {Array of Objects} [opts.slots] Set of ad slot configurations.
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
                        msg: 'Slot failed to load during call to load().',
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
        /**
         * ## harmony.log
         * Instance of Lumberjack populated with Harmony's data.
         * @see log.js
         */
        log: log,
        /**
         * ## harmony.slot(name)
         * Safely fetch an existing ad slot or a mock slot if slot was not found.
         * @param {String} name Name of the ad slot.
         * @return {Object} The ad slot or a mock ad slot.
         * @see slotset.js
         */
        slot: slots.get,
        /**
         * ## harmony.hasSlot(name)
         * Check if a slot has already been loaded into Harmony.
         * @param {String} name Name of the ad slot.
         * @return {Boolean} True if the slot has already been loaded.
         * @see slotset.js
         */
        hasSlot: slots.has,
        /**
         * ## harmony.breakpoint(name)
         * Safely fetch an existing ad slot or a mock slot if slot was not found.
         * @param {String} name Name of the ad slot.
         * @return {Object} The ad slot or a mock ad slot.
         * @see bpset.js
         */
        breakpoint: breakpoints.get,
        /**
         * ## harmony.defineSlot(opts)
         * Create a new adSlot in the page.
         * @param {String} opts.name Slot name, ex) RP01
         * @param {String} opts.id Slot's div id, ex) ad-div-RP01
         * @param {Array} opts.sizes One or many 2D arrays, ex) [300, 250]
         * @param {String} opts.adunit Full ad unit code.
         * @param {Object} [opts.targeting] Slot-specific targeting.
         * @param {Array} [opts.mapping] Size mapping.
         * @param {Boolean} [opts.companion] True if companion ad.
         * @param {Boolean} [opts.drone] True when duplicates are anticipated.
         * @param {String} [opts.breakpoint] Display point, ex) 0px-infinity
         * @param {Boolean} [opts.interstitial] True if out-of-page ad.
         * @param {Object} [opts.on] Dictionary of callbacks.
         * @param {Object} [opts.one] Dictionary of single-run callbacks.
         * @see adslot.js
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
                    msg: 'Slot failed to load during call to defineSlot()',
                    conf: opts,
                    err: err
                });
            }
        },
        /**
         * ## harmony.show
         * Showing an ad means setting style ```display:block``` and
         * calling ```googletag.display()```.
         */
        show: {
            /**
             * ### harmony.show.breakpoint(name)
             * @param {String} name
             * Show all ads at a breakpoint.
             */
            breakpoint: function (name) {
                var i, slot, el,
                    set = breakpoints.get(name),
                    len = set.length;
                log('show', {
                    msg: 'Showing ads at breakpoint',
                    breakpoint: name
                });
                try {
                    for (i = 0; i < len; i += 1) {
                        slot = set[i];
                        global.googletag.display(slot.divId);
                        el = document.getElementById(slot.divId);
                        if (el) {
                            el.style.display = 'block';
                        } else {
                            log('error', {
                                msg: 'Failed to show slot for breakpoint',
                                breakpoint: name,
                                reason: 'Slot was missing from the DOM',
                                slot: slot
                            });
                        }
                    }
                } catch (err) {
                    log('error', {
                        msg: 'Failed to show breakpoint',
                        breakpoint: name,
                        err: err
                    });
                }
            },
            /**
             * ### harmony.show.slot(name)
             * @param {String} name
             * Show a single ad slot.
             */
            slot: function (name) {
                var slot, el;
                log('show', {
                    msg: 'Showing slot',
                    name: name
                });
                try {
                    slot = slots.get(name);
                    global.googletag.display(slot.divId);
                    el = document.getElementById(slot.divId);
                    el.style.display = 'block';
                } catch (err) {
                    log('error', {
                        msg: 'Failed to show slot',
                        name: name,
                        err: err
                    });
                }
            }
        },
        /**
         * ## harmony.hide
         * Hiding an ad means setting style ```display:none```.
         */
        hide: {
            /**
             * ### harmony.hide.breakpoint(name)
             * @param {String} name
             * Hides all the ads at a breakpoint.
             */
            breakpoint: function (name) {
                var i, el,
                    set = breakpoints.get(name),
                    len = set.length;
                log('hide', 'Hiding ads at breakpoint ' + name);
                for (i = 0; i < len; i += 1) {
                    el = document.getElementById(set[i].divId);
                    if (el) {
                        el.style.display = 'none';
                    } else {
                        log('error', {
                            msg: 'Failed to hide slot for breakpoint',
                            breakpoint: name,
                            reason: 'Slot was missing from the DOM',
                            id: set[i].divId
                        });
                    }
                }
            },
            /**
             * ### harmony.hide.slot(name)
             * @param {String} name
             * Hides a single ad slot.
             */
            slot: function (name) {
                var el,
                    slot = slots.get(name);
                log('hide', {
                    msg: 'Hiding slot',
                    name: name
                });
                try {
                    el = document.getElementById(slot.divId);
                    el.style.display = 'none';
                } catch (err) {
                    log('error', {
                        msg: 'Failed to hide slot',
                        name: name,
                        err: err
                    });
                }
            }
        }
    }).implement(
        /**
         * ## harmony.on/one/off/trigger
         * Exposes event handling at the system level.
         * @see event-handler.js
         */
        Eventable()
    );
};
