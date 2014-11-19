var Conf = require('./slot-options.helper.js'),
    Harmony = require('../../src/harmony.js'),
    $ = require('jquery');

module.exports = {
    createDiv: function (opts, content) {
        $('<div>', {
            id: opts.id,
            'class': 'testdiv ' + opts.breakpoint,
            text: content
        }).appendTo('body');
    },
    getConf: function () {
        return {
            slots: [
                Conf({
                    name: 'TST00',
                    id: 'DVID00',
                    breakpoint: 'TSTPNT00'
                }),
                Conf({
                    name: 'TST01',
                    id: 'DVID01',
                    breakpoint: 'TSTPNT01'
                }),
                Conf({
                    name: 'TST02',
                    id: 'DVID02',
                    breakpoint: 'TSTPNT00'
                })
            ],
            targeting: {}
        };
    },
    setupDOM: function () {
        var conf = this.getConf(),
            makeDiv = this.createDiv;
        conf.slots.forEach(function (slot) {
            makeDiv(slot);
        });
        return conf;
    }
};
