/**
 * # Load Action
 */

var AdSlot = require('../adslot.js'),
    Util = require('../util.js'),
    watcher = require('../breakpoint-watcher.js'),
    slots = require('../slot-set.js'),
    groups = require('../group-set.js'),
    log = require('../log.js');

/**
 * ## harmony.load(opts)
 * Load a block of configuration.
 * @param {Object} [opts.targeting] System-level targeting.
 * @param {Array of Objects} [opts.slots] Set of ad slot configurations.
 * @param {Number|Array of Numbers} [opts.breakpoints] Set of breakpoints.
 * @see adslot.js https://cobbdb.github.io/harmony/adslot.js
 */
module.exports = function (opts) {
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
            groups.add(slot.group, slot);
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

    // Assign the breakpoints.
    watcher.add(opts.breakpoints);

    log('load', 'Harmony config loaded.');
};
