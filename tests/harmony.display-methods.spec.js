var Harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Conf = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('display method', function () {
    var harmony;
    beforeEach(function () {
        Help.setupDOM();
        harmony = Harmony();
        harmony.load(Help.getConf());
    });
    describe('show', function () {
        describe('breakpoint()', function () {
            it('throws no errors when breakpoint does not exist', function () {
                expect(function () {
                    harmony.show.breakpoint('badpnt');
                }).not.toThrowError();
            });
            it('calls display on slots', function () {
                harmony.show.breakpoint('TSTPNT00');
                expect(googletag.display.calls.count()).toEqual(2);
            });
            it('sets display:block on slots', function () {
                harmony.show.breakpoint('TSTPNT01');
                var el = $('#DVID01')[0];
                expect(el.style.display).toEqual('block');
            });
        });
        describe('slot()', function () {
            it('throws no errors when slot is missing from the dom', function () {
                $('#DVID01').remove();
                expect(function () {
                    harmony.show.slot('TST01');
                }).not.toThrow();
            });
            it('calls display on a slot', function () {
                harmony.show.slot('TST00');
                expect(googletag.display).toHaveBeenCalled();
            });
            it('sets display:block on a slot', function () {
                harmony.show.slot('TST02');
                var el = $('#DVID02')[0];
                expect(el.style.display).toEqual('block');
            });
        });
    });
    describe('hide', function () {
        describe('breakpoint()', function () {
            it('throws no errors when breakpoint does not exist', function () {
                expect(function () {
                    harmony.hide.breakpoint('badpnt');
                }).not.toThrowError();
            });
            it('sets display:none on slots', function () {
                harmony.hide.breakpoint('TSTPNT00');
                var set = $('.TSTPNT00');
                expect(set.length).toEqual(2);
                expect(set[0].style.display).toEqual('none', 'set[0], TSTPNT00');
                expect(set[1].style.display).toEqual('none', 'set[1], TSTPNT00');
                set = $('.TSTPNT01');
                expect(set.length).toEqual(1);
                expect(set[0].style.display).not.toEqual('none', 'set[0], TSTPNT01');
            });
            it('works with duplicates', function () {
                // Smoke test that mappings look right.
                expect(harmony.slot('TST01').divId).toEqual('DVID01', 'divId, precheck');

                // Create a duplicate TST01.
                var conf = Conf({
                    name: 'TST01',
                    id: 'DVID01',
                    breakpoint: 'TSTPNT01'
                });
                Help.createDiv(conf);
                harmony.defineSlot(conf);
                // Ensure the new mappings are correct.
                expect(harmony.slot('TST01').divId).toEqual('DVID01');
                expect(harmony.slot('TST01-h1').divId).toEqual('DVID01-h1');

                // Hide the breakpoint and ensure all divs are hidden.
                harmony.hide.breakpoint('TSTPNT01');
                var set = $('.TSTPNT01');
                expect(set.length).toEqual(2);
                expect(set[0].style.display).toEqual('none', 'set[0]');
                expect(set[1].style.display).toEqual('none', 'set[1]');
            });
        });
        describe('slot()', function () {
            it('throws no errors when slot is missing from the dom', function () {
                $('#DVID01').remove();
                expect(function () {
                    harmony.hide.slot('TST01');
                }).not.toThrow();
            });
            it('sets display:none on a slot', function () {
                harmony.hide.slot('TST01');
                var el = $('#DVID01')[0];
                expect(el.style.display).toEqual('none');
                el = $('#DVID00')[0];
                expect(el.style.display).not.toEqual('none');
            });
        });
    });
});
