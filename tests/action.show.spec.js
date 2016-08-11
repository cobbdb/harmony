var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Conf = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('harmony.show', function () {
    beforeEach(function () {
        Help.setupDOM();
        var conf = Help.getConf();
        harmony.load.slots(conf.slots);
    });
    describe('slot()', function () {
        it('throws no errors when slot is missing from the dom', function () {
            $('#DVID01').remove();
            expect(function () {
                harmony.show.slot('TST01');
            }).not.toThrow();
        });
        it('calls dfp methods on an enabled slot', function () {
            var slot = harmony.slot('TST00');
            harmony.show.slot('TST00');
            expect(googletag.display).toHaveBeenCalled();
            expect(googletag.defineSlot).toHaveBeenCalled();
            expect(slot.gpt.addService).toHaveBeenCalledWith(googletag.pubads());
        });
        it('does not call dfp methods on a disabled slot', function () {
            var slot = harmony.slot('TST00');
            harmony.disable.slot('TST00');
            harmony.show.slot('TST00');
            expect(googletag.display).not.toHaveBeenCalled();
            expect(googletag.defineSlot).toHaveBeenCalled();
            expect(slot.gpt.addService).not.toHaveBeenCalled();
        });
        it('calls refresh for already active slots', function () {
            var slot = harmony.slot('TST00');
            expect(slot.active).toBe(false);
            expect(googletag.display.calls.count()).toBe(0);

            harmony.show.slot('TST00');
            expect(slot.active).toBe(true);
            expect(googletag.pubads().refresh.calls.count()).toBe(0);
            expect(googletag.display.calls.count()).toBe(1);

            harmony.show.slot('TST00');
            expect(googletag.pubads().refresh.calls.count()).toBe(1);
            expect(googletag.display.calls.count()).toBe(1);
        });
    });
    describe('group()', function () {
        it('throws no errors when group does not exist', function () {
            expect(function () {
                harmony.show.group('badgrp');
            }).not.toThrowError();
        });
        it('calls dfp methods on enabled slots', function () {
            var slot00 = harmony.slot('TST00');
            var slot01 = harmony.slot('TST01');
            var slot02 = harmony.slot('TST02');
            harmony.show.group('TSTGRP00');
            expect(googletag.display.calls.count()).toEqual(2, 'display()');
            expect(googletag.defineSlot.calls.count()).toEqual(3, 'defineSlot()');
            expect(slot00.gpt.addService).toHaveBeenCalledWith(googletag.pubads());
            expect(slot01.gpt.addService).not.toHaveBeenCalledWith(googletag.pubads());
            expect(slot02.gpt.addService).toHaveBeenCalledWith(googletag.pubads());
        });
        it('does not call dfp methods on disabled slots', function () {
            var slot00 = harmony.slot('TST00');
            var slot01 = harmony.slot('TST01');
            var slot02 = harmony.slot('TST02');
            harmony.slot('TST00').enabled = false;
            harmony.show.group('TSTGRP00');
            expect(googletag.display.calls.count()).toEqual(1, 'display()');
            expect(googletag.defineSlot.calls.count()).toEqual(3, 'defineSlot()');
            expect(slot00.gpt.addService).not.toHaveBeenCalledWith(googletag.pubads());
            expect(slot01.gpt.addService).not.toHaveBeenCalledWith(googletag.pubads());
            expect(slot02.gpt.addService).toHaveBeenCalledWith(googletag.pubads());
        });
        it('calls refresh for already active slots', function () {
            var slot = harmony.slot('TST02');
            expect(slot.active).toBe(false);
            expect(googletag.display.calls.count()).toBe(0);

            harmony.show.group('TSTGRP00');
            expect(slot.active).toBe(true);
            expect(googletag.pubads().refresh.calls.count()).toBe(0);
            expect(googletag.display.calls.count()).toBe(2);

            harmony.show.group('TSTGRP00');
            expect(googletag.pubads().refresh.calls.count()).toBe(2);
            expect(googletag.display.calls.count()).toBe(2);
        });
    });
});
