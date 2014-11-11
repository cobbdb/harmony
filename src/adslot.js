var log = require('./log.js');

/**
 * # Ad Slot
 * Constructs a new adSlot in the page.
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
 */
//function AdSlot(pubads, opts) {
module.exports = function (pubads, opts) {
    var slot, i;
    // Create the callback queue for this slot.
    var cbQueue = {
        slotRenderEnded: []
    };
    // Capture timestamp for performance metrics.
    var tsCreate = new Date();
    log('init', {
        msg: 'Creating new ad slot.',
        conf: opts
    });

    // Set default values.
    var mapping = opts.mapping || [];
    var companion = opts.companion || false;
    var interstitial = opts.interstitial || false;
    var targeting = opts.targeting || {};

    // Define which type of slot this is.
    if (opts.interstitial) {
        slot = googletag.defineOutOfPageSlot(opts.adunit, opts.id);
    } else {
        slot = googletag.defineSlot(opts.adunit, opts.sizes, opts.id);
    }

    /**
     * ## harmony.slot.&lt;name&gt;.divId
     * Slot's containing div id.
     * @type {String}
     */
    slot.divId = opts.id;
    /**
     * ## harmony.slot.&lt;name&gt;.name
     * Slot's name.
     * @type {String}
     */
    slot.name = opts.name;
    /**
     * ## harmony.slot.&lt;name&gt;.breakpoint
     * This slot's breakpoint.
     * @type {String}
     */
    slot.breakpoint = opts.breakpoint;
    /**
     * ## harmony.slot.&lt;name&gt;.sizes
     * This slot's possible sizes. Note, this is
     * not the current size of the ad slot.
     * @type {Array}
     */
    slot.sizes = opts.sizes;
    /**
     * ## harmony.slot.&lt;name&gt;.adunit
     * Ad unit code of this ad slot.
     */
    slot.adunit = opts.adunit;

    // Set slot-specific targeting. No need to introspect
    // because unused targeting is ignored by dfp.
    for (i in targeting) {
        slot.setTargeting(i, targeting[i]);
    }

    // Assign size mapping for responsive ad slots.
    slot.defineSizeMapping(mapping);

    // Load any provided callback into queue.
    if (typeof opts.callback === 'function') {
        cbQueue.slotRenderEnded.push(opts.callback);
        log('init', 'Attached provided callback for ' + opts.name);
    }

    /**
     * ## harmony.slot.&lt;name&gt;.on
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

    // Attach a listener for the slotRenderEnded event.
    pubads.addEventListener('slotRenderEnded', function (event) {
        var i, len, now;
        if (event.slot === slot) {
            log('event', 'slotRenderEnded for ' + opts.name);
            // Log the total load time of this slot.
            now = new Date();
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
        slot.addService(googletag.companionAds());
    }

    // Add the publisher service and return the new ad slot.
    slot.addService(pubads);
    return slot;
};
