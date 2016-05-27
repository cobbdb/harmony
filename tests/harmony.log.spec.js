var harmony = require('../src/harmony.js');

describe('Logging', function () {
    it('is disabled by default', function () {
        harmony.log('test', 'abc123');
        var readback = harmony.log.readback.master();
        expect(readback.length).toEqual(0);
    });
    it('can be enabled with option', function () {
        var readback;
        harmony.log.enable();
        harmony.log('test', 'abc123');
        harmony.log('test', 'abc321');

        readback = harmony.log.readback.master();
        expect(readback.length).toBeGreaterThan(0);

        readback = harmony.log.readback('test');
        expect(readback.length).toEqual(2);
        expect(readback[1].data).toEqual('abc321');
    });
});
