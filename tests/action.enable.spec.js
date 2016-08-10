var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js');

describe('harmony.enable', function () {
    beforeEach(function () {
        Help.setupDOM();
        var conf = Help.getConf();
        harmony.load.slots(conf.slots);
        harmony.slot('TST00').enabled = false;
        harmony.slot('TST01').enabled = false;
        harmony.slot('TST02').enabled = false;
    });
    describe('slot()', function () {
        it('throws no errors when slot does not exist', function () {
            expect(function () {
                harmony.enable.slot('BAD01');
            }).not.toThrow();
        });
        it('enables only a single slot', function () {
            harmony.enable.slot('TST01');
            expect(harmony.slot('TST00').enabled).toBe(false);
            expect(harmony.slot('TST01').enabled).toBe(true);
            expect(harmony.slot('TST02').enabled).toBe(false);
        });
    });
    describe('group()', function () {
        it('throws no errors when group does not exist', function () {
            expect(function () {
                harmony.enable.group('badgrp');
            }).not.toThrowError();
        });
        it('enables all slots in the group', function () {
            harmony.enable.group('TSTGRP00');
            expect(harmony.slot('TST00').enabled).toBe(true);
            expect(harmony.slot('TST01').enabled).toBe(false);
            expect(harmony.slot('TST02').enabled).toBe(true);
        });
    });
});
