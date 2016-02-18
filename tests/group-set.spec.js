var GroupSet = require('../src/group-set.js');

describe('GroupSet', function () {
    describe('add', function () {
        it('throws no errors', function () {
            expect(function () {
                GroupSet.add('testpoint', {
                    data: 'testdata'
                });
            }).not.toThrow();
        });
    });
    describe('get', function () {
        it('returns empty array on bad name', function () {
            var set = GroupSet.get('not-here');
            expect(set).toEqual([]);
        });
        it('returns previously added data', function () {
            GroupSet.add('testname', {
                val: 'testval1'
            });
            GroupSet.add('testname', {
                val: 'testval2'
            });
            var set = GroupSet.get('testname');
            expect(set.length).toEqual(2);
            expect(set[0].val).toEqual('testval1');
            expect(set[1].val).toEqual('testval2');
        });
    });
    describe('clear', function () {
        it('removes all existing data', function () {
            GroupSet.add('testname', {
                val: 'testval'
            });
            var set = GroupSet.get('testname');
            expect(set.length).toEqual(1);
            GroupSet.clear();
            set = GroupSet.get('testname');
            expect(set.length).toEqual(0);
        });
    });
});
