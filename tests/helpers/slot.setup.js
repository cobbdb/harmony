var GroupFactory = require('../../src/modules/group-factory.js'),
    SlotCache = require('../../src/modules/slot-cache.js'),
    masterGroup = require('../../src/modules/master-group.js'),
    scrubConf = require('../../src/util/scrub-conf.js'),
    $ = require('jquery');

afterEach(function () {
    googletag.pubadsReady = void(0);
    $('.testdiv').remove();
    GroupFactory.clear();
    masterGroup.clear();
    SlotCache.clear();
    scrubConf.clear();
});
