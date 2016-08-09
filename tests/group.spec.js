var Group = require('../src/types/group.js');

describe('Group', function () {
    it('can have a name', function () {
        var group = Group('test-name');
        expect(group.name).toEqual('test-name');
    });
    it('is not required to have a name', function () {
        var group = Group();
        expect(group.name).toBeUndefined();
    });
    describe('length()', function () {
        it('returns the current length', function () {
            var group = Group();
            expect(group.length()).toEqual(0);
        });
    });
    describe('get()', function () {
        it('returns null on bad name', function () {
            var group = Group();
            var slot = group.get('not-here');
            expect(slot).toBeNull();
        });
        it('returns previously added data', function () {
            var group = Group();
            group.add({
                name: 'testname1',
                val: 'testval1'
            });
            group.add({
                name: 'testname2',
                val: 'testval2'
            });
            expect(group.length()).toEqual(2);
            expect(group.get('testname1').val).toEqual('testval1');
            expect(group.get('testname2').val).toEqual('testval2');
        });
    });
    describe('getAll()', function () {
        it('returns all slots in the group', function () {
            var group = Group();
            group.add({});
            group.add({});
            group.add({});
            expect(group.getAll().length).toEqual(3);
        });
    });
    describe('clear()', function () {
        it('removes all existing data', function () {
            var group = Group();
            group.add({
                name: 'testname',
                val: 'testval'
            });
            expect(group.length()).toEqual(1);
            group.clear();
            expect(group.length()).toEqual(0);
        });
    });
});
