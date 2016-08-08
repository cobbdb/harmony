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
 * @param {boolean} [opts.outofpage] True if out-of-page ad.
 * @param {boolean} [opts.enabled] False if ineligible to make ad calls.
 * @param {Object<string, function(?)>} [opts.on] Dictionary of callbacks.
 * @param {Object<string, function(?)>} [opts.one] Dictionary of single-run callbacks.
 * @return {AdSlot}
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag.SizeMappingBuilder
 */

var log = require('../modules/log.js'),
    cache = require('../modules/slot-cache.js'),
    EventHandler = require('./event-handler.js'),
    googletag = require('../modules/googletag.js');

module.exports = function (opts) {
    var slot, events = EventHandler({
            events: opts.on,
            singles: opts.one
        });

    if (opts.outofpage) {
        slot = googletag.defineOutOfPageSlot(opts.adunit, opts.id);
    } else {
        slot = googletag.defineSlot(opts.adunit, opts.sizes, opts.id);
    }
    for (name in opts.targeting) {
        slot.setTargeting(name, opts.targeting[name]);
    }
    if (opts.mapping) {
        slot.defineSizeMapping(opts.mapping);
    }
    if (opts.companion) {
        slot.addService(googletag.companionAds());
    }

    return {
        name: opts.name,
        id: opts.id,
        sizes: opts.sizes,
        adunit: opts.adunit,
        group: opts.group || null,
        companion: opts.companion || false,
        outofpage: opts.outofpage || false,
        enabled: opts.enabled === false ? false : true,
        on: events.on,
        one: events.one,
        off: events.off,
        trigger: events.trigger,
        active: false,
        gpt: slot,
        activate: function () {
            if (!this.active) {
                var pubads = googletag.pubads();
                /**
                 * ## slot.on('slotRenderEnded', callback)
                 * @param {function({Object})} cb
                 * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
                 */
                pubads.addEventListener('slotRenderEnded', function (event) {
                    if (event.slot === slot) {
                        events.trigger('slotRenderEnded', event);
                    }
                });
                /**
                 * ## slot.on('impressionViewable', callback)
                 * @param {function({Object})} cb
                 * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
                 */
                pubads.addEventListener('impressionViewable', function (event) {
                    if (event.slot === slot) {
                        events.trigger('impressionViewable', event);
                    }
                });
                this.gpt.addService(pubads);
                this.active = true;
            }
        }
    };
};
