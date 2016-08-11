var listConcatLeft = require('../src/util/list-concat-left.js');

describe('util/list-concat-left', function () {
    var first, second;
    beforeEach(function () {
        first = {
            prop1: [123, 234],
            prop2: 321,
            prop3: 567
        };
        second = {
            prop1: [345, 456, 567],
            prop2: [432],
            prop4: 987
        };
    });
    it('does not require arguments', function () {
        expect(function () {
            listConcatLeft();
            listConcatLeft({});
            listConcatLeft({}, {});
        }).not.toThrow();
    });
    it('merges left', function () {
        var map = listConcatLeft(first, second);
        expect(map).toEqual({
            prop1: [123, 234, 345, 456, 567],
            prop2: [321, 432],
            prop3: [567],
            prop4: [987]
        });
    });
});
