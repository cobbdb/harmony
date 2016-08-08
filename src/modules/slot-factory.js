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
    masterGroup = require('../modules/master-group.js');

module.exports = {
    create: function (conf) {
        var slot, group;
        if (masterGroup.has(conf.name)) {
            slot = masterGroup.get(conf.name);
        } else {
            slot = Slot(conf);
            masterGroup.add(slot);
            if (slot.group) {
                group = GroupFactory.create(slot.group);
                group.add(slot);
            }
        }
        return slot;
    },
    get: function (name) {
        if (masterGroup.has(name)) {
            return masterGroup.get(name);
        }
        return MockSlot(name);
    }
};
