var BpSet = require('../../src/bpset.js'),
    SlotSet = require('../../src/slotset.js'),
    $ = require('jquery');

afterEach(function () {
    $('.testdiv').remove();
    BpSet.clear();
    SlotSet.clear();
});
