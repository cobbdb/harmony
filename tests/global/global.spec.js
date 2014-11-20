/**
 * Just smoke-test a few global properties.
 */
describe('Global variable', function () {
    it('is provided', function () {
        expect(Harmony).toBeDefined();
    });
    it('is constructor', function () {
        var harmony = Harmony();
        expect(harmony.defineSlot).toBeDefined();
        expect(harmony.show).toBeDefined();
    });
});
