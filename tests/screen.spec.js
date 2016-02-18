var screen = require('../src/screen.js');

describe('Screen Util - screen.spec.js', function () {
    it('returns a positive number', function () {
        expect(screen.width()).toBeGreaterThan(0);
        expect(screen.height()).toBeGreaterThan(0);
    });
});
