var Conf = require('./slot-options.helper.js'),
    $ = require('jquery');

module.exports = {
    createDiv: function (opts, content) {
        $('<div>', {
            id: opts.id,
            'class': 'testdiv ' + opts.group,
            text: content
        }).appendTo('body');
    },
    getConf: function () {
        return {
            slots: [
                Conf({
                    name: 'TST00',
                    id: 'DVID00',
                    group: 'TSTGRP00'
                }),
                Conf({
                    name: 'TST01',
                    id: 'DVID01',
                    group: 'TSTGRP01'
                }),
                Conf({
                    name: 'TST02',
                    id: 'DVID02',
                    group: 'TSTGRP00'
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
