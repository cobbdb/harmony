var SlotSet = require('../src/slotset.js');

describe('SlotSet', function () {
    describe('add', function () {
        it('throws no errors', function () {
            expect(function () {
                SlotSet.add({
                    name: 'testname'
                });
            }).not.toThrow();
        });
    });
    describe('get', function () {
        it('returns mock slot on bad name', function () {
            var slot = SlotSet.get('not-here');
            expect(slot.divId).toBeUndefined();
            expect(slot.on).toBeDefined();
            expect(slot.setTargeting).toBeDefined();
        });
        it('returns previously added data', function () {
            SlotSet.add({
                name: 'testname',
                val: 'testval'
            });
            var slot = SlotSet.get('testname');
            expect(slot.val).toEqual('testval');
        });
    });
    describe('has', function () {
        it('checks for previously added data', function () {
            SlotSet.add({
                name: 'testname2',
                val: 'testval2'
            });
            expect(SlotSet.has('testname')).toBe(false, 'testname');
            expect(SlotSet.has('testname1')).toBe(false, 'testname1');
            expect(SlotSet.has('testname2')).toBe(true, 'testname2');
            expect(SlotSet.has('testname3')).toBe(false, 'testname3');
        });
    });
    describe('clear', function () {
        it('removes all previous data', function () {
            SlotSet.add({
                name: 'testname',
                val: 'testval'
            });
            var slot = SlotSet.get('testname');
            expect(slot.val).toEqual('testval');
            SlotSet.clear();
            slot = SlotSet.get('testname');
            expect(slot.val).toBeUndefined();
            expect(slot.mock).toEqual(true);
        });
    });
    describe('cached', function () {
        describe('callbacks', function () {
            it('queues ahead', function (done) {
                var slot = SlotSet.get('mock');
                expect(slot.mock).toBe(true);
                slot.on('evt1', function (num) {
                    expect(num).toEqual(321);
                });
                slot.on('evt1', function (num) {
                    expect(num).toEqual(123);
                });
                slot.on('evt2', function (num) {
                    expect(num).toEqual(132);
                    done();
                });
                slot.one('evt2', function (num) {
                    expect(num).toEqual(321);
                    done();
                });
                var cbs = SlotSet.cached.callbacks('mock');
                expect(cbs.events.evt1.length).toEqual(2);
                cbs.events.evt1[0](321);
                cbs.events.evt1[1](123);
                expect(cbs.events.evt2.length).toEqual(1);
                cbs.events.evt2[0](132);
                expect(cbs.singles.evt2.length).toEqual(1);
                cbs.singles.evt2[0](321);
            });
        });
        describe('targeting', function () {
            it('queues ahead', function () {
                var slot = SlotSet.get('mock');
                expect(slot.mock).toBe(true);
                slot.setTargeting('key1', 'val1');
                slot.setTargeting('key2', 'val2');
                var targeting = SlotSet.cached.targeting('mock');
                expect(targeting.key1).toEqual('val1');
                expect(targeting.key2).toEqual('val2');
            });
            it('returns safely if missing', function () {
                var slot = SlotSet.get('mock');
                expect(slot.mock).toBe(true);
                var targeting = SlotSet.cached.targeting('mock');
                expect(targeting.key1).not.toBeDefined();
            });
        });
    });
});
