/**
 * # GPT System Events
 * Connect GPT events with the Harmony event handler.
 */

var googletag = require('../modules/googletag.js'),
    events = require('../modules/master-event-handler.js');

googletag.cmd.push(function () {
    /**
     * ## harmony.on('slotRenderEnded', callback)
     * @param {!function(googletag.events.SlotRenderEndedEvent)} callback Called each time any ad call completes.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
     */
    googletag.pubads().addEventListener('slotRenderEnded', function (event) {
        events.trigger('slotRenderEnded', event);
    });
    /**
     * ## harmony.on('impressionViewable', callback)
     * @param {!function(googletag.events.ImpressionViewableEvent)} callback Called each time any slot registers a viewed impression.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
     */
    googletag.pubads().addEventListener('impressionViewable', function (event) {
        events.trigger('impressionViewable', event);
    });
    /**
     * ## harmony.on('slotOnload', callback)
     * @param {!function(googletag.events.SlotOnloadEvent)} callback Fired when the creative's iframe fires its load event.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotonloadevent
     */
    googletag.pubads().addEventListener('slotOnload', function (event) {
        events.trigger('slotOnload', event);
    });
    /**
     * ## harmony.on('slotVisibilityChanged', callback)
     * @param {!function(googletag.events.slotVisibilityChangedEvent)} callback Fired whenever the on-screen percentage of an ad slot's area changes.
     * @see types/event-handler.js
     * @see https://developers.google.com/doubleclick-gpt/reference#googletageventsslotvisibilitychangedevent
     */
    googletag.pubads().addEventListener('slotVisibilityChanged', function (event) {
        events.trigger('slotVisibilityChanged', event);
    });
});
