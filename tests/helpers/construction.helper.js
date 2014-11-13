var Options = require('./slot-options.helper.js'),
    Harmony = require('../../src/harmony.js'),
    $ = require('jquery');

afterEach(function () {
    $('.testdiv').remove();
});

module.exports = {
    createDiv: function (opts) {
        $('<div>', {
            id: opts.id,
            'class': 'testdiv ' + opts.breakpoint
        }).appendTo('body');
    },
    getConf: function () {
        return {
            slots: [
                Options({
                    name: 'TST00',
                    id: 'DVID00',
                    breakpoint: 'TSTPNT00'
                }),
                Options({
                    name: 'TST01',
                    id: 'DVID01',
                    breakpoint: 'TSTPNT01'
                }),
                Options({
                    name: 'TST02',
                    id: 'DVID02',
                    breakpoint: 'TSTPNT00'
                })
            ],
            targeting: {}
        };
    },
    setupDOM: function () {
        this.getConf.slots.forEach(this.createDiv);
    }
};
