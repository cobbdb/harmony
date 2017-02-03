var harmony = require('../src/harmony.js'),
    Options = require('./helpers/slot-options.helper.js'),
    Help = require('./helpers/construction.helper.js');

describe('accessor', function () {
    beforeEach(function () {
        Help.setupDOM();
        var conf = Help.getConf();
        harmony.load.slots(conf.slots);
        harmony.load.targeting(conf.targeting);
    });
    describe('harmony.slot()', function () {
        it('fetches an existing ad slot', function () {
            var slot = harmony.slot('TST01');
            expect(slot.mock).toBeUndefined();
            expect(slot.id).toEqual('DVID01-h1');
        });
        it('fetches a mock slot by default', function () {
            var slot = harmony.slot('BAD01');
            expect(slot.mock).toBe(true);
            expect(slot.divId).toBeUndefined();
        });
        it('can cache targeting', function () {
            var slot = harmony.slot('new1');
            expect(slot.mock).toBe(true);
            slot.gpt.setTargeting('key1', 'val1');
            var opts = Options({
                id: 'newid',
                name: 'new1',
                targeting: {
                    key2: 'val2'
                }
            });
            Help.createDiv({
                id: 'newid'
            });
            harmony.defineSlot(opts);
            slot = harmony.slot('new1');
            expect(slot.mock).toBeUndefined();
            expect(slot.gpt.setTargeting).toHaveBeenCalledWith('key1', 'val1');
            expect(slot.gpt.setTargeting).toHaveBeenCalledWith('key2', 'val2');
        });
    });
    describe('harmony.group()', function () {
        it('fetches an existing group', function () {
            var group = harmony.group('TSTGRP00');
            expect(group.length()).toEqual(2);
            expect(group.get('TST02').id).toEqual('DVID02-h1');
        });
        it('fetches an empty array by default', function () {
            var group = harmony.group('BAD02');
            expect(group.length()).toEqual(0);
            expect(group.getAll()).toEqual([]);
        });
    });
});
