var harmony = require('../src/harmony.js'),
    Options = require('./helpers/slot-options.helper.js'),
    Help = require('./helpers/construction.helper.js');

describe('accessor', function () {
    beforeEach(function () {
        Help.setupDOM();
        harmony.load(Help.getConf());
    });
    describe('harmony.slot()', function () {
        it('fetches an existing ad slot', function () {
            var slot = harmony.slot('TST01');
            expect(slot.mock).toBeUndefined();
            expect(slot.divId).toEqual('h-ad-2');
        });
        it('fetches a mock slot by default', function () {
            var slot = harmony.slot('BAD01');
            expect(slot.mock).toBe(true);
            expect(slot.divId).toBeUndefined();
        });
        it('can cache targeting', function () {
            var slot = harmony.slot('new1');
            expect(slot.mock).toBe(true);
            slot.setTargeting('key1', 'val1');
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
            expect(slot.setTargeting).toHaveBeenCalledWith('key1', 'val1');
            expect(slot.setTargeting).toHaveBeenCalledWith('key2', 'val2');
        });
    });
    describe('harmony.group()', function () {
        it('fetches an existing group', function () {
            var group = harmony.group('TSTGRP00');
            expect(group.length).toEqual(2);
            expect(group[1].divId).toEqual('h-ad-3');
        });
        it('fetches an empty array by default', function () {
            var group = harmony.group('BAD02');
            expect(group.length).toEqual(0);
            expect(group).toEqual([]);
        });
    });
});
