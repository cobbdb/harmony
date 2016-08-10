var MockSlot = require('../src/types/mock-slot.js'),
    SlotCache = require('../src/modules/slot-cache.js');

describe('MockSlot', function () {
    it('exposes certain fields', function () {
        var slot = MockSlot();
        expect(slot.mock).toBe(true);
        expect(slot.name).toBeUndefined();
        expect(function () {
            slot.on('testevent', function () {});
            slot.one('testevent', function () {});
            slot.trigger('somename');
            slot.off('othername');
            slot.gpt.setTargeting('key', 'value');
        }).not.toThrow();
    });
    it('can have a name', function () {
        var slot = MockSlot('testname');
        expect(slot.name).toBe('testname');
    });
    describe('can cache', function () {
        it('events', function () {
            var slot = MockSlot('testname');
            slot.on('evt1', 'test-data');
            slot.on('evt1', function () {});
            slot.on('evt2', function () {});
            slot.one('evt2', function () {});
            var cache = SlotCache('testname');
            expect(cache.get.events().evt1.length).toBe(2);
            expect(cache.get.singles().evt1).toBeUndefined();
            expect(cache.get.events().evt2.length).toBe(1);
            expect(cache.get.singles().evt2.length).toBe(1);
        });
        it('targeting', function () {
            var slot = MockSlot('testname');
            slot.gpt.setTargeting('key1', 'val1');
            slot.gpt.setTargeting('key2', 'val2');
            var cache = SlotCache('testname');
            expect(cache.get.targeting().key1).toEqual('val1');
            expect(cache.get.targeting().key2).toEqual('val2');
        });
    });
});
