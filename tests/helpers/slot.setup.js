var GroupFactory = require('../../src/modules/group-factory.js'),
    SlotCache = require('../../src/modules/slot-cache.js'),
    masterGroup = require('../../src/modules/master-group.js'),
    $ = require('jquery'),
    ids = require('../../src/util/id-factory.js');

afterEach(function () {
    $('.testdiv').remove();
    GroupFactory.clear();
    masterGroup.clear();
    SlotCache.clear();
    ids.curr = 0;
});
