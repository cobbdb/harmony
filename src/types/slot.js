/**
 * # Ad Slot
 * Constructs a new adSlot in the page.
 * @param {Object} opts
 * @param {string} opts.name Slot name, ex) RP01
 * @param {string} opts.id Slot's container id, ex) ad-div-RP01
 * @param {(Array<number, number>|Array<Array<number, number>>)} opts.sizes
 * ex) `[300, 250]` or `[[88, 31], [300, 600]]`.
 * @param {string} opts.adunit Full ad unit code.
 * @param {Array<string>|string} [opts.group] Group name. Can be a set of
 * names to add this slot to multiple groups.
 * @param {Object<string, string>} [opts.targeting] Slot-specific custom
 * critera key-value targeting.
 * @param {boolean} [opts.companion] True if companion ad.
 * @param {SizeMapping} [opts.mapping] Size mapping.
 * @param {boolean} [opts.outofpage] True if out-of-page ad.
 * @param {boolean} [opts.preserveId] True to never mangle the container id.
 * @param {boolean} [opts.enabled] False if ineligible to make ad calls.
 * @param {Object<string, function>} [opts.on] Dictionary of callbacks.
 * @param {Object<string, function>} [opts.one] Dictionary of single-run callbacks.
 * @return {AdSlot}
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag.SizeMappingBuilder
 */

var log = require('../modules/log.js'),
    SlotCache = require('../modules/slot-cache.js'),
    EventHandler = require('./event-handler.js'),
    googletag = require('../modules/googletag.js'),
    concatLeft = require('../util/list-concat-left.js'),
    mergeLeft = require('../util/map-merge-left.js'),
    bindGPTEvents = require('../util/bind-gpt-events.js');

module.exports = function (opts) {
    var slot, name,
        cache = SlotCache(opts.name),
        events = EventHandler({
            events: concatLeft(opts.on, cache.get.events()),
            singles: concatLeft(opts.one, cache.get.singles())
        }),
        targeting = mergeLeft(opts.targeting, cache.get.targeting());

    // Create the GPT slot instance.
    if (opts.outofpage) {
        slot = googletag.defineOutOfPageSlot(opts.adunit, opts.id);
    } else {
        slot = googletag.defineSlot(opts.adunit, opts.sizes, opts.id);
    }

    // Apply any slot-level targeting.
    for (name in targeting) {
        slot.setTargeting(name, targeting[name]);
    }

    // Apply the size mapping if set.
    if (opts.mapping) {
        slot.defineSizeMapping(opts.mapping);
    }

    /**
     * ## event.slot._name
     * Attach the name to the native googletag.Slot object for use during GPT events.
     * ```js
     * harmony.on('slotRenderEnded', function (event) {
     *     var name = event.slot._name;
     * });
     * ```
     * @type {!string}
     */
    slot._name = opts.name;
    // *Deprecated* Do not use `event.slot.name`. Scheduled for removal.
    slot.name = opts.name;

    /**
     * ## event.slot._id
     * Attach the slot id to the native googletag.Slot object for use during GPT events.
     * ```js
     * harmony.on('slotRenderEnded', function (event) {
     *     var id = event.slot._id;
     * });
     * ```
     * @type {!string}
     */
    slot._id = opts.id;

    /**
     * ## Slot
     * @type {Slot}
     */
    return {
        /**
         * ### name
         * Name of this slot in the system.
         * @type {!string}
         */
        name: opts.name,
        /**
         * ### id
         * DOM element id of this slot's container.
         * @type {!string}
         */
        id: opts.id,
        /**
         * ### sizes
         * List of *possible* sizes this slot can accept.
         * @type {!(Array<number, number>|Array<Array<number, number>>)}
         */
        sizes: opts.sizes,
        /**
         * ### adunit
         * Fully qualified adunit this slot is targeting.
         * @type {!string}
         */
        adunit: opts.adunit,
        /**
         * ### group
         * @type {?Group}
         * @see Group
         */
        group: opts.group || null,
        /**
         * ### companion
         * @type {!boolean}
         */
        companion: opts.companion || false,
        /**
         * ### outofpage
         * @type {!boolean}
         */
        outofpage: opts.outofpage || false,
        /**
         * ### enabled
         * True when this slot is eligible to make ad calls.
         * @type {!boolean}
         */
        enabled: opts.enabled === false ? false : true,
        /**
         * ### on()
         * @type {function(string, function)}
         * @see EventHandler
         */
        on: events.on,
        /**
         * ### one()
         * @type {function(string, function)}
         * @see EventHandler
         */
        one: events.one,
        /**
         * ### off()
         * @type {function()}
         * @see EventHandler
         */
        off: events.off,
        /**
         * ### trigger()
         * @type {function(string, ?)}
         * @see EventHandler
         */
        trigger: events.trigger,
        /**
         * ### active
         * *Danger Zone* True when this slot has already been displayed.
         * @api private
         * @type {!boolean}
         */
        active: false,
        /**
         * ### gpt
         * *Danger Zone* The registered GPT Slot.
         * @type {!googletag.Slot}
         * @see https://developers.google.com/doubleclick-gpt/reference#googletag.Slot
         */
        gpt: slot,
        /**
         * ### activate()
         * *Danger Zone*
         * @api private
         */
        activate: function () {
            if (!this.active) {
                /**
                 * ### on(GPTEventName, callback)
                 * Can be one of:
                 * * slotRenderEnded
                 * * impressionViewable
                 * * slotOnload
                 * * slotVisibilityChanged
                 * @see util/bind-gpt-events.js
                 */
                bindGPTEvents(events, slot);

                // Attach GPT services and flag this slot as active.
                slot.addService(googletag.pubads());
                if (this.companion) {
                    slot.addService(googletag.companionAds());
                }
                this.active = true;
            }
        }
    };
};
