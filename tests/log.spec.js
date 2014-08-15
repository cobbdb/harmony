describe('Logging', function () {
    it('is disabled by default', function () {
        var harmony = Harmony();
        harmony.log('test', 'abc123');
        var readback = harmony.log.readback.master();
        expect(readback.length).toEqual(0);
    });
    it('can be enabled with option', function () {
        var harmony = Harmony({
            forceLog: true
        });
        harmony.log('test', 'abc123');
        var readback = harmony.log.readback.master();
        expect(readback.length).toBeGreaterThan(0);
    });
});
