var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Options = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('harmony setup', function () {
    var conf;
    beforeEach(function () {
        harmony.log.enable();
        harmony.log.clear();
    });
    describe('harmony.load()', function () {
        beforeEach(function () {
            conf = Help.setupDOM();
        });
        it('creates ad slots', function () {
            harmony.load(conf);
            expect(harmony.slot('TST00').divId).toEqual('h-ad-1');
            expect(harmony.slot('TST01').group).toEqual('TSTGRP01');
            expect(harmony.slot('TST02').name).toEqual('TST02');
        });
        it('does not require conf', function () {
            expect(function () {
                harmony.load();
            }).not.toThrow();
        });
        it('supports empty conf', function () {
            expect(function () {
                harmony.load({});
            }).not.toThrow();
        });
        it('handles duplicate slot names with missing div', function () {
            conf.slots[2].id = 'DVID00';
            conf.slots[2].name = 'TST00';
            // Do not create the new DVID00 element.
            harmony.load(conf);
            expect(harmony.slot('TST00').name).toEqual('TST00');
            expect(harmony.slot('TST00').divId).toEqual('h-ad-1');
            expect(harmony.slot('TST01').name).toEqual('TST01');
            expect(harmony.slot('TST01').divId).toEqual('h-ad-2');
            expect(harmony.slot('TST00-h3').name).toBeUndefined();
            expect(harmony.slot('TST00-h3').divId).toBeUndefined();

            // Smoke test DOM and error logs.
            expect($('#h-ad-1, #h-ad-2, #h-ad-3').length).toEqual(2);
            expect(harmony.log.readback('error').length).toEqual(1);
        });
        it('handles duplicate slot names with no missing divs', function () {
            conf.slots[2].id = 'DVID00';
            conf.slots[2].name = 'TST00';
            Help.createDiv(conf.slots[2]);
            harmony.load(conf);
            expect(harmony.slot('TST00').name).toEqual('TST00');
            expect(harmony.slot('TST00').divId).toEqual('h-ad-1');
            expect(harmony.slot('TST00-h3').name).toEqual('TST00-h3');
            expect(harmony.slot('TST00-h3').divId).toEqual('h-ad-3');

            // Smoke test DOM and error logs.
            expect($('#h-ad-1, #h-ad-2, #h-ad-3').length).toEqual(3);
            expect(harmony.log.readback('error').length).toEqual(0);
        });
        it('sets system targeting', function () {
            conf.targeting.TST = 'target';
            conf.targeting.TST2 = 'abc123';
            harmony.load(conf);
            expect(googletag.pubads().setTargeting).toHaveBeenCalledWith('TST', 'target');
            expect(googletag.pubads().setTargeting).toHaveBeenCalledWith('TST2', 'abc123');
        });
        it('logs missing dom elements', function () {
            conf.slots[1].name = 'BAD01';
            conf.slots[1].id = 'BAD01';
            harmony.load(conf);
            expect(harmony.log.readback('error').length).toEqual(1);
        });
    });
    describe('harmony.defineSlot()', function () {
        var newConf = function () {
                return Options({
                    name: 'TST22',
                    group: 'GRP22',
                    id: 'DVID22' // becomes h-ad-1.
                });
            },
            newSlot = function () {
                var conf = newConf();
                Help.createDiv(conf);
                return conf;
            };
        it('creates an ad slot', function () {
            var opts = newSlot();
            harmony.defineSlot(opts);
            expect(harmony.slot('TST22').group).toEqual('GRP22');
            expect(harmony.group('GRP22')[0].divId).toEqual('h-ad-1');
        });
        it('handles duplicate slots', function () {
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            expect(harmony.slot('TST22').divId).toEqual('h-ad-1');
            expect(harmony.slot('TST22-h2').divId).toEqual('h-ad-2');
            expect(harmony.slot('TST22-h3').divId).toEqual('h-ad-3');
            expect(harmony.slot('TST22-h4').divId).toEqual('h-ad-4');
        });
        it('logs missing dom elements', function () {
            var opts = newSlot();
            opts.id = 'NOTHERE';
            harmony.defineSlot(opts);
            expect(harmony.slot('TST22').name).toBeUndefined();
            var errors = harmony.log.readback('error');
            expect(errors.length).toEqual(1);
            expect(errors[0].data.conf.name).toEqual('TST22');
            expect(errors[0].data.conf.id).toEqual('NOTHERE');
        });
    });
});
