/**
 * # Ad Slot
 * Constructs a new adSlot in the page.
 * @api private
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
function AdSlot(pubads, opts) {
    log('Creating new ad slot.');
    var slot, i, targeting;
    // Create the callback queue for this slot.
    var cbQueue = {
        slotRenderEnded: []
    };

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
        log('Attached provided callback.');
    }

    // Create the on() method for attaching callbacks.
    slot.on = function (event, cb) {
        cbQueue[event] = cb;
    };

    // Attach a listener for the slotRenderEnded event.
    pubads.addEventListener('slotRenderEnded', function (event) {
        var i, len;
        if (event.slot === slot) {
            log('slotRenderEnded for ' + opts.name);
            len = slot.cmd.slotRenderEnded.length;
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
