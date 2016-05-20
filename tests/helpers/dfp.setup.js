/**
 * Mock the DFP API and construction options.
 */
beforeEach(function () {
    // Pubads service.
    var pubadsSpy = jasmine.createSpyObj('pubadsSpy', [
        'setTargeting',
        'addEventListener',
        'refresh'
    ]);
    global.googletag = jasmine.createSpyObj('googletag', [
        'defineOutOfPageSlot',
        'defineSlot',
        'companionAds',
        'pubads',
        'display'
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
