var googletag = require('../../src/modules/googletag.js');

/**
 * Mock the DFP API and construction options.
 */
beforeEach(function () {
    // GPT service spies.
    var pubadsSpy = jasmine.createSpyObj('pubads', [
        'setTargeting',
        'addEventListener',
        'refresh',
        'disableInitialLoad'
    ]);
    var compAdsSpy = jasmine.createSpy('compads');

    // Create GPT API members.
    googletag.defineSlot = jasmine.createSpy('defineSlot');
    googletag.defineOutOfPageSlot = jasmine.createSpy('defineOutOfPageSlot');
    googletag.companionAds = jasmine.createSpy('companionAds');
    googletag.pubads = jasmine.createSpy('pubads');
    googletag.display = jasmine.createSpy('display');
    googletag.enableServices = jasmine.createSpy('enableServices');

    // API behaviors.
    googletag.pubads.and.returnValue(pubadsSpy);
    googletag.companionAds.and.returnValue(compAdsSpy);
    googletag.enableServices.and.callFake(function () {
        googletag.pubadsReady = true;
    });
    googletag.defineOutOfPageSlot.and.callFake(function () {
        return jasmine.createSpyObj('oop-slot', [
            'setTargeting',
            'defineSizeMapping',
            'addService'
        ]);
    });
    googletag.defineSlot.and.callFake(function () {
        return jasmine.createSpyObj('slot', [
            'setTargeting',
            'defineSizeMapping',
            'addService'
        ]);
    });
});
