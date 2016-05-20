var Harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js');

describe('harmony.refresh', function () {
    var harmony;
    beforeEach(function () {
        Help.setupDOM();
        harmony = Harmony();
        harmony.load(Help.getConf());
        harmony.slot('TST00').active = true;
        harmony.slot('TST01').active = true;
        harmony.slot('TST02').active = true;
    });
    it('refreshes all enabled slots in the system', function () {
        harmony.disable.slot('TST02');
        harmony.refresh();
        expect(googletag.pubads().refresh.calls.count()).toEqual(1);
        expect(googletag.pubads().refresh).toHaveBeenCalledWith([
            harmony.slot('TST00'),
            harmony.slot('TST01')
        ]);
    });
    describe('slot()', function () {
        it('throws no errors when slot does not exist', function () {
            expect(function () {
                harmony.refresh.slot('BAD01');
            }).not.toThrow();
        });
        it('refreshes only a single slot', function () {
            harmony.refresh.slot('TST01');
            expect(googletag.pubads().refresh.calls.count()).toEqual(1);
            expect(googletag.pubads().refresh).toHaveBeenCalledWith([
                harmony.slot('TST01')
            ]);
        });
        it('does not refresh disabled slots', function () {
            harmony.disable.slot('TST01');
            harmony.refresh.slot('TST01');
            expect(googletag.pubads().refresh.calls.count()).toEqual(0);
        });
    });
    describe('group()', function () {
        it('throws no errors when group does not exist', function () {
            expect(function () {
                harmony.refresh.group('badgrp');
            }).not.toThrowError();
        });
        it('refreshes all slots in the group', function () {
            harmony.refresh.group('TSTGRP00');
            expect(googletag.pubads().refresh.calls.count()).toEqual(1);
            expect(googletag.pubads().refresh).toHaveBeenCalledWith([
                harmony.slot('TST00'),
                harmony.slot('TST02')
            ]);
        });
        it('does not refresh disabled slots', function () {
            harmony.disable.slot('TST00');
            harmony.refresh.group('TSTGRP00');
            expect(googletag.pubads().refresh.calls.count()).toEqual(1);
            expect(googletag.pubads().refresh).toHaveBeenCalledWith([
                harmony.slot('TST02')
            ]);
        });
    });
});
