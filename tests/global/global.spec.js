/**
 * Just smoke-test a few global properties.
 */
describe('Global variable', function () {
    it('is provided', function () {
        expect(harmony).toBeDefined();
    });
    it('is constructor', function () {
        expect(harmony.defineSlot).toBeDefined();
        expect(harmony.show).toBeDefined();
    });
});
