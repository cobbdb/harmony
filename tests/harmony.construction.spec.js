var harmony = require('../src/harmony.js');

describe('construction', function () {
    it('throws no errors', function () {
        expect(harmony).toBeDefined();
    });
    it('returns a useable instance', function () {
        // Smoke check a couple attributes.
        expect(harmony.load).toBeDefined();
        expect(harmony.log).toBeDefined();
        expect(harmony.show).toBeDefined();
        expect(harmony.hide.slot).toBeDefined();
    });
});
