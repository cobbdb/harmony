var BpSet = require('../src/bpset.js');

describe('BreakpointSet', function () {
    describe('add', function () {
        it('throws no errors', function () {
            expect(function () {
                BpSet.add('testpoint', {
                    data: 'testdata'
                });
            }).not.toThrow();
        });
    });
    describe('get', function () {
        it('returns empty array on bad name', function () {
            var set = BpSet.get('not-here');
            expect(set).toEqual([]);
        });
        it('returns previously added data', function () {
            BpSet.add({
                name: 'testname',
                val: 'testval'
            });
            var set = BpSet.get('testname');
            expect(set.length).toEqual(1);
            expect(set[0].val).toEqual('testval');
        });
    });
});
