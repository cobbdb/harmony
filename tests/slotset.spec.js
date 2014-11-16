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
            expect(SlotSet.has('testname')).toBe(false, 'first');
            expect(SlotSet.has('testname2')).toBe(true, 'second');
            expect(SlotSet.has('testname3')).toBe(false, 'third');
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
});
