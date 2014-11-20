var BpSet = require('../../src/bpset.js'),
    SlotSet = require('../../src/slotset.js'),
    $ = require('jquery'),
    Util = require('../../src/util.js');

afterEach(function () {
    $('.testdiv').remove();
    BpSet.clear();
    SlotSet.clear();
    Util.slotCount = 0;
});
