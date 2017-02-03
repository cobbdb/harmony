var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Options = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('harmony.load()', function () {
    var conf;
    beforeEach(function () {
        harmony.log.enable();
        harmony.log.clear();
        conf = Help.setupDOM();
    });
    it('creates ad slots', function () {
        harmony.load.slots(conf.slots);
        expect(harmony.slot('TST00').id).toEqual('DVID00-h1');
        expect(harmony.slot('TST01').group).toEqual('TSTGRP01');
        expect(harmony.slot('TST02').name).toEqual('TST02');
    });
    it('does not require conf', function () {
        expect(function () {
            harmony.load.slots();
            harmony.load.targeting();
            harmony.load.breakpoints();
        }).not.toThrow();
    });
    it('supports empty conf', function () {
        expect(function () {
            harmony.load.slots([]);
            harmony.load.targeting({});
            harmony.load.breakpoints([]);
        }).not.toThrow();
    });
    it('handles duplicate slot names with missing div', function () {
        conf.slots[2].id = 'DVID00';
        conf.slots[2].name = 'TST00';

        // Duplicate slot container is missing, so harmony
        // should error and bail out of creating the duplicate.
        harmony.load.slots(conf.slots);
        expect(harmony.slot('TST00').name).toEqual('TST00');
        expect(harmony.slot('TST00').id).toEqual('DVID00-h1');
        expect(harmony.slot('TST01').name).toEqual('TST01');
        expect(harmony.slot('TST01').id).toEqual('DVID01-h1');
        expect(harmony.slot('TST02').id).toBeUndefined();
        expect(harmony.slot('TST00-h3').id).toBeUndefined();
        expect($('#DVID00-h1, #DVID01-h1, #DVID00-h2').length).toEqual(2);
        expect(harmony.log.readback('error').length).toEqual(1);
    });
    it('handles duplicate slot names with no missing divs', function () {
        conf.slots[2].id = 'DVID00';
        conf.slots[2].name = 'TST00';
        Help.createDiv(conf.slots[2]);

        harmony.load.slots(conf.slots);
        expect(harmony.slot('TST00').name).toEqual('TST00');
        expect(harmony.slot('TST00').id).toEqual('DVID00-h2');
        expect(harmony.slot('TST01').name).toEqual('TST01');
        expect(harmony.slot('TST01').id).toEqual('DVID01-h1');
        expect($('#DVID00-h1, #DVID01-h1, #DVID00-h2').length).toEqual(3);
        expect(harmony.log.readback('error').length).toEqual(0);
    });
    it('sets system targeting', function () {
        conf.targeting.TST = 'target';
        conf.targeting.TST2 = 'abc123';
        harmony.load.targeting(conf.targeting);
        expect(googletag.pubads().setTargeting).toHaveBeenCalledWith('TST', 'target');
        expect(googletag.pubads().setTargeting).toHaveBeenCalledWith('TST2', 'abc123');
    });
    it('logs missing dom elements', function () {
        conf.slots[1].name = 'BAD01';
        conf.slots[1].id = 'BAD01';
        harmony.load.slots(conf.slots);
        expect(harmony.log.readback('error').length).toEqual(1);
    });
});
