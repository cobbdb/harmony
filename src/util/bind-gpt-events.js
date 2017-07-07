/**
 * # Bind GPT Events
 * Connect GPT events with the Harmony event handler.
 * @param {!EventHandler} events Event handler instance to bind GPT events to.
 * @param {?googletag.Slot} [slot] Ad slot to filter events for.
 * @see types/event-handler.js
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag.Slot
 */

var googletag = require('../modules/googletag.js');

module.exports = function (events, slot) {
    var pubads = googletag.pubads();

    /**
     * ## harmony.on('slotRenderEnded', callback)
     * @param {!function(googletag.events.SlotRenderEndedEvent)} callback Fired when the DFP ad call completes.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
     */
    pubads.addEventListener('slotRenderEnded', function (event) {
        if (!slot || event.slot === slot) {
            events.trigger('slotRenderEnded', event);
        }
    });

    /**
     * ## harmony.on('impressionViewable', callback)
     * @param {!function(googletag.events.ImpressionViewableEvent)} callback Fired when an impression becomes viewable.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
     */
    pubads.addEventListener('impressionViewable', function (event) {
        if (!slot || event.slot === slot) {
            events.trigger('impressionViewable', event);
        }
    });

    /**
     * ## harmony.on('slotOnload', callback)
     * @param {!function(googletag.events.SlotOnloadEvent)} callback Fired when the creative's iframe fires its load event.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotonloadevent
     */
    pubads.addEventListener('slotOnload', function (event) {
        if (!slot || event.slot === slot) {
            events.trigger('slotOnload', event);
        }
    });

    /**
     * ## harmony.on('slotVisibilityChanged', callback)
     * @param {!function(googletag.events.slotVisibilityChangedEvent)} callback Fired whenever the on-screen percentage of an ad slot's area changes.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotvisibilitychangedevent
     */
    pubads.addEventListener('slotVisibilityChanged', function (event) {
        if (!slot || event.slot === slot) {
            events.trigger('slotVisibilityChanged', event);
        }
    });
};
