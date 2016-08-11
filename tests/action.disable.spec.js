var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js');

describe('harmony.disable', function () {
    beforeEach(function () {
        Help.setupDOM();
        var conf = Help.getConf();
        harmony.load.slots(conf.slots);
        harmony.slot('TST00').enabled = true;
        harmony.slot('TST01').enabled = true;
        harmony.slot('TST02').enabled = true;
    });
    describe('slot()', function () {
        it('throws no errors when slot does not exist', function () {
            expect(function () {
                harmony.disable.slot('BAD01');
            }).not.toThrow();
        });
        it('disables only a single slot', function () {
            harmony.disable.slot('TST01');
            expect(harmony.slot('TST00').enabled).toBe(true);
            expect(harmony.slot('TST01').enabled).toBe(false);
            expect(harmony.slot('TST02').enabled).toBe(true);
        });
    });
    describe('group()', function () {
        it('throws no errors when group does not exist', function () {
            expect(function () {
                harmony.disable.group('badgrp');
            }).not.toThrowError();
        });
        it('disables all slots in the group', function () {
            harmony.disable.group('TSTGRP00');
            expect(harmony.slot('TST00').enabled).toBe(false);
            expect(harmony.slot('TST01').enabled).toBe(true);
            expect(harmony.slot('TST02').enabled).toBe(false);
        });
    });
});
