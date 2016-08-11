var log = require('../src/modules/log.js');

describe('log', function () {
    it('is disabled by default', function () {
        log('test', 'abc123');
        var readback = log.readback.master();
        expect(readback.length).toEqual(0);
    });
    it('can be enabled on the fly', function () {
        var readback;

        log('test1', 'abc123');
        readback = log.readback.master();
        expect(readback.length).toEqual(0);

        log.enable();
        log('test2', 'abc123');
        log('test3', 'abc123');
        readback = log.readback.master();
        expect(readback.length).toEqual(2);
    });
});
