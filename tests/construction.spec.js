describe('construction', function () {
    it('throws no errors', function () {
        expect(function () {
            harmony = Harmony();
        }).not.toThrowError();
    });
    it('returns a useable instance', function () {
        harmony = Harmony();
        // Smoke check a couple attributes.
        expect(harmony.load).toBeDefined();
        expect(harmony.log).toBeDefined();
        expect(harmony.show).toBeDefined();
        expect(harmony.show.slot).toBeDefined();
    });
});
