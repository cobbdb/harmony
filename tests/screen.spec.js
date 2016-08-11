var screen = require('../src/modules/screen.js');

describe('screen', function () {
    it('returns a positive number', function () {
        expect(screen.width()).toBeGreaterThan(0);
        expect(screen.height()).toBeGreaterThan(0);
    });
});
