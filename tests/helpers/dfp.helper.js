/**
 * Mock the DFP API and construction options.
 */
var pubadsSpy;
beforeEach(function () {
    googletag = jasmine.createSpyObj('googletag', [
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
