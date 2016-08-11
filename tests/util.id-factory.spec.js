var ids = require('../src/util/id-factory.js');

describe('util/id-factory', function () {
    it('starts at zero', function () {
        expect(ids.curr).toBe(0);
    });
    it('increments by one', function () {
        expect(ids.curr).toBe(0);

        var next = ids.next();
        expect(ids.curr).toBe(1);
        expect(next).toBe(1);

        next = ids.next();
        expect(ids.curr).toBe(2);
        expect(next).toBe(2);
    });
});
