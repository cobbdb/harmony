var GroupSet = require('../../src/group-set.js'),
    SlotSet = require('../../src/slot-set.js'),
    $ = require('jquery'),
    Util = require('../../src/util.js');

afterEach(function () {
    $('.testdiv').remove();
    GroupSet.clear();
    SlotSet.clear();
    Util.slotCount = 0;
});
