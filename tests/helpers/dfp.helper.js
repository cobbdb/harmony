/**
 * Mock the DFP API and construction options.
 */

var pubadsSpy;

module.exports = {
    spies: {
        pubads: pubadsSpy
    }
};

// Setup DFP spies before each spec.
beforeEach(function () {
    global.googletag = jasmine.createSpyObj('googletag', [
        'defineOutOfPageSlot',
        'defineSlot',
        'companionAds',
        'pubads',
        'display'
    ]);
    // Pubads service.
    pubadsSpy = jasmine.createSpyObj('pubadsSpy', [
        'setTargeting',
        'addEventListener'
    ]);
    googletag.pubads.and.returnValue(pubadsSpy);
    // Slot constructors.
    googletag.defineOutOfPageSlot.and.callFake(function () {
        return jasmine.createSpyObj('outOfPageSlotSpy', [
            'setTargeting',
            'defineSizeMapping',
            'addService'
        ]);
    });
    googletag.defineSlot.and.callFake(function () {
        return jasmine.createSpyObj('slotSpy', [
            'setTargeting',
            'defineSizeMapping',
            'addService'
        ]);
    });
});
