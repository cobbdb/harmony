var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    events = require('../src/modules/master-event-handler.js');

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
    describe('initialLoad()', function () {
        afterEach(function () {
            harmony.disable.initialLoadRestored = false;
        });
        it('calls pubads disableInitialLoad', function () {
            harmony.disable.initialLoad();
            expect(googletag.pubads().disableInitialLoad).toHaveBeenCalled();
        });
        it('listens for the SRM call before restoring', function () {
            spyOn(events, 'one');
            harmony.disable.initialLoad(true);
            expect(events.one.calls.argsFor(0)[0]).toEqual('slotRenderEnded');
            expect(typeof events.one.calls.argsFor(0)[1]).toEqual('function');
        });
        it('flags to restore after SRM completes', function () {
            expect(harmony.disable.initialLoadRestored).toBe(false);
            harmony.disable.initialLoad(true);
            expect(harmony.disable.initialLoadRestored).toBe(false);
            
            events.trigger('slotRenderEnded');
            expect(harmony.disable.initialLoadRestored).toBe(true);
        });
        it('flags to restore only if requested', function () {
            expect(harmony.disable.initialLoadRestored).toBe(false);
            harmony.disable.initialLoad();
            expect(harmony.disable.initialLoadRestored).toBe(false);
            
            events.trigger('slotRenderEnded');
            expect(harmony.disable.initialLoadRestored).toBe(false);
        });
    });
});
