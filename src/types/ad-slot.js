var log = require('./log.js'),
    slots = require('./slot-set.js'),
    BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js');

/**
 * # Ad Slot
 * Constructs a new adSlot in the page.
 * @param {Object} opts
 * @param {string} opts.name Slot name, ex) RP01
 * @param {string} opts.id Slot's div id, ex) ad-div-RP01
 * @param {(Array<number, number>|Array<Array<number, number>>)} opts.sizes
 * ex) [300, 250] or [[88, 31], [300, 600]]
 * @param {string} opts.adunit Full ad unit code.
 * @param {string} [opts.group] Slot group name.
 * @param {Object<string, string>} [opts.targeting] Slot-specific targeting.
 * @param {boolean} [opts.companion] True if companion ad.
 * @param {SizeMapping} [opts.mapping] Size mapping.
 * @param {boolean} [opts.interstitial] True if out-of-page ad.
 * @param {boolean} [opts.enabled] False if ineligible to make ad calls.
 * @param {Object<string, function(?)>} [opts.on] Dictionary of callbacks.
 * @param {Object<string, function(?)>} [opts.one] Dictionary of single-run callbacks.
 * @return {AdSlot}
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag.SizeMappingBuilder
 */
module.exports = function (pubads, opts) {
    var name, cbCache, slot,
        // Capture timestamp for performance metrics.
        tsCreate = global.Date.now(),
        mapping = opts.mapping || [],
        companion = opts.companion || false,
        interstitial = opts.interstitial || false,
        targeting = opts.targeting || {};

    // Define which type of slot this is.
    if (opts.interstitial) {
        slot = googletag.defineOutOfPageSlot(opts.adunit, opts.id);
    } else {
        slot = googletag.defineSlot(opts.adunit, opts.sizes, opts.id);
    }

    // Deep merge all event callbacks.
    cbCache = slots.cached.callbacks(opts.name);
    opts.on = opts.on || [];
    for (name in opts.on) {
        cbCache.events[name] = cbCache.events[name] || [];
        cbCache.events[name] = [].concat(
            cbCache.events[name],
            opts.on[name]
        );
    }
    opts.one = opts.one || [];
    for (name in opts.one) {
        cbCache.singles[name] = cbCache.singles[name] || [];
        cbCache.singles[name] = [].concat(
            cbCache.singles[name],
            opts.one[name]
        );
    }

    /**
     * ## harmony.slot(name).on/one/off/trigger
     * Exposes event handling at the slot level.
     * @see <a href="event-handler.js">event-handler.js</a>
     */
    BaseClass(slot).extend(
        Eventable(cbCache)
    );

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
     * ## harmony.slot(name).group
     * This slot's group.
     * @type {String}
     */
    slot.group = opts.group;
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
     * @type {String}
     */
    slot.adunit = opts.adunit;
    /**
     * ## harmony.slot(name).enabled
     * @type {Boolean}
     */
    slot.enabled = opts.enabled === false ? false : true;
    /**
     * ## harmony.slot(name).active
     * True if this slot has ever had an ad call.
     * @type {Boolean}
     */
    slot.active = false;

    // Set slot-specific targeting. No need to introspect
    // because unused targeting is ignored by dfp.
    for (name in targeting) {
        slot.setTargeting(name, targeting[name]);
    }

    // Load in any targeting set before this slow was defined.
    targeting = slots.cached.targeting(opts.name);
    for (name in targeting) {
        slot.setTargeting(name, targeting[name]);
    }

    // Assign size mapping for responsive ad slots.
    slot.defineSizeMapping(mapping);

    // Load any provided callback into queue.
    // ```opts.callback``` is legacy.
    if (typeof opts.callback === 'function') {
        slot.on('slotRenderEnded', opts.callback);
    }

    // Attach a listener for the slotRenderEnded event.
    pubads.addEventListener('slotRenderEnded', function (event) {
        var now;
        if (event.slot === slot) {
            now = global.Date.now();
            log('metric', {
                event: 'DFP Call Complete',
                slot: opts.name,
                timeSinceCalled: now - slot.tsCalled, // Can be NaN.
                timeSinceCreated: now - tsCreate
            });

            // Trigger any attached behaviors.
            slot.trigger('slotRenderEnded', event);
        }
    });

    // Assign companion ad service if requested.
    if (companion) {
        slot.addService(
            global.googletag.companionAds()
        );
    }

    // Add the publisher service and return the new slot.
    slot.addService(pubads);
    return slot;
};
