var enableServices = require('../src/util/enable-services.js');

describe('util/enable-services', function () {
    it('enables services only once', function () {
        expect(googletag.enableServices.calls.count()).toBe(0);
        expect(googletag.pubadsReady).toBeUndefined();
        enableServices();
        expect(googletag.enableServices.calls.count()).toBe(1);
        enableServices();
        enableServices();
        enableServices();
        expect(googletag.enableServices.calls.count()).toBe(1);
        expect(googletag.pubadsReady).toBe(true);
    });
});
