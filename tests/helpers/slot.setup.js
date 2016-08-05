var GroupSet = require('../../src/group-set.js'),
    SlotSet = require('../../src/slot-set.js'),
    $ = require('jquery'),
    ids = require('../../src/util/id-factory.js');

afterEach(function () {
    $('.testdiv').remove();
    GroupSet.clear();
    SlotSet.clear();
    ids.curr = 0;
});
