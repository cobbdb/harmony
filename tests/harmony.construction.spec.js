var Harmony = require('../src/harmony.js');

describe('construction', function () {
    it('throws no errors', function () {
        expect(function () {
            var harmony = Harmony();
        }).not.toThrowError();
    });
    it('returns a useable instance', function () {
        var harmony = Harmony();
        // Smoke check a couple attributes.
        expect(harmony.load).toBeDefined();
        expect(harmony.log).toBeDefined();
        expect(harmony.show).toBeDefined();
        expect(harmony.hide.slot).toBeDefined();
    });
});
