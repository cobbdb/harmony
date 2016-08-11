/**
 * Just smoke-test a few global properties.
 */
describe('Global variable', function () {
    it('is provided as "harmony"', function () {
        expect(harmony).toBeDefined();
    });
    it('is defined', function () {
        expect(harmony.defineSlot).toBeDefined();
        expect(harmony.show).toBeDefined();
    });
});
