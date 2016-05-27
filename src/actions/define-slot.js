/**
 * # Define Slot Action
 */

var AdSlot = require('../adslot.js'),
    Util = require('../util.js'),
    slots = require('../slot-set.js'),
    groups = require('../group-set.js'),
    log = require('../log.js');

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
 * @param {String} [opts.group] Slot group name.
 * @param {Boolean} [opts.interstitial] True if out-of-page ad.
 * @param {Boolean} [opts.enabled] False if ineligible to make ad calls.
 * @param {Object} [opts.on] Dictionary of callbacks.
 * @param {Object} [opts.one] Dictionary of single-run callbacks.
 * @return {AdSlot}
 * @see adslot.js
 */
module.exports = function (opts) {
    var slot;
    try {
        slot = AdSlot(
            global.googletag.pubads(),
            Util.scrubConf(opts)
        );
        slots.add(slot);
        groups.add(opts.group, slot);
    } catch (err) {
        log('error', {
            msg: 'Slot failed to load during call to defineSlot()',
            conf: opts,
            err: err
        });
    }
    return slot;
};
