var Util = require('../src/util.js'),
    slots = require('../src/slot-set.js'),
    Conf = require('./helpers/slot-options.helper.js'),
    Help = require('./helpers/construction.helper.js'),
    $ = require('jquery');

describe('Util', function () {
    it('provides a noop', function () {
        expect(typeof Util.noop).toEqual('function');
        expect(function () {
            Util.noop();
        }).not.toThrow();
    });

    describe('scrubConf', function () {
        it('throws when missing DOM element', function () {
            expect(function () {
                var conf = Conf({
                    name: 'testname',
                    id: 'testid',
                    group: 'testgrp'
                });
                Util.scrubConf(conf);
            }).toThrow();
        });
        it('alters only id when no duplicate', function () {
            var conf = Conf({
                name: 'testname',
                id: 'testid',
                group: 'testgrp'
            });
            Help.createDiv(conf);
            var out = Util.scrubConf(conf);
            expect(out.name).toEqual('testname');
            expect(out.id).toEqual('h-ad-1');
        });
        it('increments id and name per duplicate', function () {
            var i, conf, out = [];

            for (i = 0; i < 4; i += 1) {
                conf = Conf({
                    name: 'testname',
                    id: 'testid',
                    group: 'testgrp'
                });
                Help.createDiv(conf);
                out[i] = Util.scrubConf(conf);
                slots.add(out[i]);
            }

            expect(out[0].name).toEqual('testname');
            expect(out[0].id).toEqual('h-ad-1');
            expect(out[1].name).toEqual('testname-h2');
            expect(out[1].id).toEqual('h-ad-2');
            expect(out[2].name).toEqual('testname-h3');
            expect(out[2].id).toEqual('h-ad-3');
            expect(out[3].name).toEqual('testname-h4');
            expect(out[3].id).toEqual('h-ad-4');
        });
    });
});
