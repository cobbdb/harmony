/**
 * # Slot Factory
 * Constructs a new ad slot.
 * Three different scenarios here:
 * 1. AdSlot exists already, return it.
 * 2. Slot's conf exists already, convert to AdSlot and return it.
 * 3. No data found, return mock.
 */

var Slot = require('../types/slot.js'),
    MockSlot = require('../types/mock-slot.js'),
    GroupFactory = require('./group-factory.js'),
    masterGroup = require('../modules/master-group.js'),
    scrubConf = require('../util/scrub-conf.js'),
    log = require('./log.js');

module.exports = {
    /**
     * ## create(options)
     * @param {Object} conf
     * @return {?Slot} Null on error.
     */
    create: function (conf) {
        var slot, group;
        try {
            conf = scrubConf(conf);
            slot = Slot(conf);
            masterGroup.add(slot);
            if (slot.group) {
                group = GroupFactory.create(slot.group);
                group.add(slot);
            }
        } catch (err) {
            log('error', {
                conf: conf,
                msg: err.message
            });
        } finally {
            return slot || null;
        }
    },
    /**
     * ## get(name)
     * @param {string} name
     * @return {!(Slot|MockSlot)}
     */
    get: function (name) {
        if (masterGroup.has(name)) {
            return masterGroup.get(name);
        }
        return MockSlot(name);
    }
};
