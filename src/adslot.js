var log = require('./log.js'),
    set = require('./slotset.js');

/**
 * # Ad Slot
 * Constructs a new adSlot in the page.
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
 */
module.exports = function (pubads, opts) {
    var slot, i,
        // Grab any preloaded callbacks.
        cbQueue = set.cached.callbacks(opts.name),
        // Capture timestamp for performance metrics.
        tsCreate = new Date().getTime(),
        mapping = opts.mapping || [],
        companion = opts.companion || false,
        interstitial = opts.interstitial || false,
        targeting = opts.targeting || {};

    log('init', {
        msg: 'Creating new ad slot.',
        conf: opts
    });

    // Smoke test that the slot's element id is valid in the DOM.
    if (!global.document.getElementById(opts.id)) {
        throw Error('Ad slot container was not found in the DOM.');
    }

    // Define which type of slot this is.
    if (opts.interstitial) {
        slot = global.googletag.defineOutOfPageSlot(opts.adunit, opts.id);
    } else {
        slot = global.googletag.defineSlot(opts.adunit, opts.sizes, opts.id);
    }

    /**
     * ## harmony.slot(name).divId
     * Slot's containing div id.
     * @type {String}
     */
    slot.divId = opts.id;
    /**
     * ## harmony.slot(name).name
     * Slot's name.
     * @type {String}
     */
    slot.name = opts.name;
    /**
     * ## harmony.slot(name).breakpoint
     * This slot's breakpoint.
     * @type {String}
     */
    slot.breakpoint = opts.breakpoint;
    /**
     * ## harmony.slot(name).sizes
     * This slot's possible sizes. Note, this is
     * not the current size of the ad slot.
     * @type {Array}
     */
    slot.sizes = opts.sizes;
    /**
     * ## harmony.slot(name).adunit
     * Ad unit code of this ad slot.
     */
    slot.adunit = opts.adunit;

    // Set slot-specific targeting. No need to introspect
    // because unused targeting is ignored by dfp.
    for (i in targeting) {
        slot.setTargeting(i, targeting[i]);
    }

    // Load in any targeting set before this slow was defined.
    targeting = set.cached.targeting(opts.name);
    for (i in targeting) {
        slot.setTargeting(i, targeting[i]);
    }

    // Assign size mapping for responsive ad slots.
    slot.defineSizeMapping(mapping);

    // Load any provided callback into queue.
    cbQueue.slotRenderEnded = cbQueue.slotRenderEnded || [];
    if (typeof opts.callback === 'function') {
        cbQueue.slotRenderEnded.push(opts.callback);
        log('init', 'Attached provided callback for ' + opts.name);
    }

    /**
     * ## harmony.slot(name).on(event, cb)
     * Attaches a callback to a DFP event. Currently, only the
     * slotRenderEnded event is offered by the DFP API.
     * @param {String} event Name of the event to bind to.
     * @param {Function} cb Callback after the event has fired.
     * @see Official-Docs https://developers.google.com/doubleclick-gpt/reference?rd=1#googletag.events.SlotRenderEndedEvent
     */
    slot.on = function (event, cb) {
        cbQueue[event] = cbQueue[event] || [];
        cbQueue[event].push(cb);
        log('init', 'Attached new callback for ' + event);
    };

    /**
     * ## harmony.slot(name).trigger(event, data)
     * Manually fire an event.
     * @param {String} event Name of the event.
     * @param {Any} [data] Data to pass to each callback.
     */
    slot.trigger = function (event, data) {
        var i, len;
        if (event in cbQueue) {
            log('event', 'Triggering ' + event);
            len = cbQueue[event].length;
            for (i = 0; i < len; i += 1) {
                cbQueue[event][i](data);
            }
        } else {
            log('event', {
                msg: 'Failed to trigger ' + event,
                reason: 'No callbacks were found.'
            });
        }
    };

    // Attach a listener for the slotRenderEnded event.
    pubads.addEventListener('slotRenderEnded', function (event) {
        var i, len, now;
        if (event.slot === slot) {
            log('event', 'slotRenderEnded for ' + opts.name);
            // Log the total load time of this slot.
            now = new Date().getTime();
            log('metric', {
                event: 'Total load time',
                slot: opts.name,
                value: now - tsCreate
            });
            // Perform any attached callbacks.
            len = cbQueue.slotRenderEnded.length;
            for (i = 0; i < len; i += 1) {
                cbQueue.slotRenderEnded[i](event);
            }
        }
    });

    // Assign companion ad service if requested.
    if (companion) {
        slot.addService(
            global.googletag.companionAds()
        );
    }

    // Add the publisher service and return the new ad slot.
    slot.addService(pubads);
    return slot;
};
