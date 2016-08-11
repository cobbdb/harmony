var mapMergeLeft = require('../src/util/map-merge-left.js');

describe('util/map-merge-left', function () {
    it('does not require arguments', function () {
        expect(function () {
            mapMergeLeft();
            mapMergeLeft({});
            mapMergeLeft({}, {});
        }).not.toThrow();
    });
    it('merges left', function () {
        var first = {
            name: 'Bob',
            lname: 'Doe'
        };
        var second = {
            name: 'Joan',
            age: 38
        };
        var map = mapMergeLeft(first, second);
        expect(map).toEqual({
            name: 'Joan',
            lname: 'Doe',
            age: 38
        });
    });
});
