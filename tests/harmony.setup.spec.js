var Harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Options = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('harmony setup', function () {
    var harmony, conf;
    beforeEach(function () {
        harmony = Harmony({
            forceLog: true
        });
        harmony.log.clear();
    });
    describe('harmony.load()', function () {
        beforeEach(function () {
            conf = Help.setupDOM();
        });
        it('creates ad slots', function () {
            harmony.load(conf);
            expect(harmony.slot('TST00').divId).toEqual('DVID00');
            expect(harmony.slot('TST01').breakpoint).toEqual('TSTPNT01');
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
        it('handles duplicate slot names', function () {
            conf.slots[2].id = 'DVID00';
            conf.slots[2].name = 'TST00';
            harmony.load(conf);
            expect(harmony.slot('TST00').name).toEqual('TST00');
            expect(harmony.slot('TST00').divId).toEqual('DVID00');
            expect(harmony.slot('TST00-h1').divId).toEqual('DVID00-h1');
            expect(harmony.slot('TST00-h1').name).toEqual('TST00-h1');
        });
        it('adjusts element ids for duplicates', function () {
            conf.slots[2].id = 'DVID00';
            conf.slots[2].name = 'TST00';
            harmony.load(conf);
            var slot = harmony.slot('TST00-h1'),
                el = document.getElementById(slot.divId);
            expect(el.id).toEqual('DVID00-h1');
            expect(slot.divId).toEqual('DVID00-h1');
            // Smoke test error logs.
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
                    breakpoint: 'BKP22',
                    id: 'DVID22'
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
            expect(harmony.slot('TST22').breakpoint).toEqual('BKP22');
            expect(harmony.breakpoint('BKP22')[0].divId).toEqual('DVID22');
        });
        it('handles duplicate slot names for sync pages', function () {
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            expect(harmony.slot('TST22').divId).toEqual('DVID22');
            expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1');
            expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2');
            expect(harmony.slot('TST22-h3').divId).toEqual('DVID22-h3');
        });
        it('handles duplicate slot names for async pages', function () {
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            // Simulate completed ad calls.
            $('.BKP22').text('test ad content');
            // Load in a new async ad slot.
            harmony.defineSlot(newSlot());
            // Simulate completed ad calls.
            $('.BKP22').text('test ad content');
            // Load in some new async ad slots.
            harmony.defineSlot(newSlot());
            harmony.defineSlot(newSlot());
            expect(harmony.slot('TST22').divId).toEqual('DVID22');
            expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1');
            expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2');
            expect(harmony.slot('TST22-h3').divId).toEqual('DVID22-h3');
            expect(harmony.slot('TST22-h4').divId).toEqual('DVID22-h4');
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
