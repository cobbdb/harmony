var SlotFactory = require('../src/modules/slot-factory.js'),
    GroupFactory = require('../src/modules/group-factory.js'),
    masterGroup = require('../src/modules/master-group.js'),
    Help = require('./helpers/construction.helper.js');

describe('SlotFactory', function () {
    describe('create()', function () {
        it('adds to the master group', function () {
            var slots = Help.setupDOM().slots;
            expect(masterGroup.get('TST01')).toBeNull();
            SlotFactory.create(slots[1]);
            expect(masterGroup.get('TST01')).not.toBeNull();
            expect(masterGroup.get('TST01').mock).toBeUndefined();
        });
        it('adds to assigned group', function () {
            var slots = Help.setupDOM().slots;
            expect(masterGroup.get('TST01')).toBeNull();
            expect(GroupFactory.create('TSTGRP01').length()).toBe(0);
            SlotFactory.create(slots[1]);
            expect(masterGroup.get('TST01')).not.toBeNull();
            expect(GroupFactory.create('TSTGRP01').length()).toBe(1);
        });
        it('mangles id by default', function () {
            var slot = Help.setupDOM().slots[2];
            SlotFactory.create(slot);
            expect(slot.id).toEqual('DVID02-h1');
        });
        it('preserves id when requested', function () {
            var slot = Help.setupDOM().slots[2];
            slot.preserveId = true;
            SlotFactory.create(slot);
            expect(slot.id).toEqual('DVID02');
        });
    });
    describe('get()', function () {
        it('returns mock slot on bad name', function () {
            var slot = SlotFactory.get('not-here');
            expect(slot.mock).toBe(true);
        });
        it('returns previously added data', function () {
            var slots = Help.setupDOM().slots;
            var reference = [123, 456];
            slots[0].sizes = reference;
            SlotFactory.create(slots[0]);
            var slot = SlotFactory.get('TST00');
            expect(slot.sizes).toBe(reference);
        });
    });
});
