/**
 * # Slot Factory
 * Construct or fetch an ad slot.
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
        var slot, set;
        try {
            if (!conf.preserveId) {
                conf = scrubConf(conf);
            }
            slot = Slot(conf);
            masterGroup.add(slot);
            if (slot.group) {
                set = [].concat(slot.group);
                set.forEach(function (groupName) {
                    var group = GroupFactory.create(groupName);
                    group.add(slot);
                });
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
