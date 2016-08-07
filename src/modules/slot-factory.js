/**
 * # Slot Factory
 * Constructs a new ad slot.
 * Three different scenarios here:
 * 1. AdSlot exists already, return it.
 * 2. Slot's conf exists already, convert to AdSlot and return it.
 * 3. No data found, return mock.
 */

var AdSlot = require('../types/ad-slot.js'),
    MockSlot = require('../types/mock-slot.js'),
    group = require('../modules/master-group.js'),
    cache = require('../modules/slot-cache.js');

module.exports = {
    create: function (conf) {
        var slot;
        if (group.has(conf.name)) {
            slot = group.get(conf.name);
        } else if (cache.has.config(conf.name)) {
            slot = AdSlot(conf);
            group.add(slot);
        } else {
            slot = MockSlot(conf.name);
        }
        return slot;
    }
};
