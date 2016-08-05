var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Conf = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('display method', function () {
    beforeEach(function () {
        Help.setupDOM();
        harmony.load(Help.getConf());
    });
    describe('show', function () {
        describe('group()', function () {
            it('throws no errors when group does not exist', function () {
                expect(function () {
                    harmony.show.group('badgrp');
                }).not.toThrowError();
            });
            it('calls display on enabled slots', function () {
                harmony.show.group('TSTGRP00');
                expect(googletag.display.calls.count()).toEqual(2);
            });
            it('does not call display on disabled slots', function () {
                harmony.slot('TST00').enabled = false;
                harmony.show.group('TSTGRP00');
                expect(googletag.display.calls.count()).toEqual(1);
            });
            it('sets display:block on slots', function () {
                harmony.show.group('TSTGRP01');
                var el = $('#h-ad-2')[0];
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
            it('calls display on an enabled slot', function () {
                harmony.show.slot('TST00');
                expect(googletag.display).toHaveBeenCalled();
            });
            it('does not call display on a disabled slot', function () {
                harmony.disable.slot('TST00');
                harmony.show.slot('TST00');
                expect(googletag.display).not.toHaveBeenCalled();
            });
            it('sets display:block on a slot', function () {
                harmony.show.slot('TST02');
                var el = $('#h-ad-3')[0];
                expect(el.style.display).toEqual('block');
            });
        });
    });
    describe('hide', function () {
        describe('group()', function () {
            it('throws no errors when group does not exist', function () {
                expect(function () {
                    harmony.hide.group('badgrp');
                }).not.toThrowError();
            });
            it('sets display:none on slots', function () {
                harmony.hide.group('TSTGRP00');
                var set = $('.TSTGRP00');
                expect(set.length).toEqual(2);
                expect(set[0].style.display).toEqual('none', 'set[0], TSTGRP00');
                expect(set[1].style.display).toEqual('none', 'set[1], TSTGRP00');
                set = $('.TSTGRP01');
                expect(set.length).toEqual(1);
                expect(set[0].style.display).not.toEqual('none', 'set[0], TSTGRP01');
            });
            it('works with duplicates', function () {
                // Smoke test that mappings look right.
                expect(harmony.slot('TST01').divId).toEqual('h-ad-2', 'divId, precheck');

                // Create a duplicate TST01.
                var conf = Conf({
                    name: 'TST01', // becomes TST01-4.
                    id: 'DVID01', // becomes h-ad-4.
                    group: 'TSTGRP01'
                });
                Help.createDiv(conf);
                harmony.defineSlot(conf);
                // Ensure the new mappings are correct.
                expect(harmony.slot('TST01').divId).toEqual('h-ad-2');
                expect(harmony.slot('TST01-h4').divId).toEqual('h-ad-4');

                // Hide the group and ensure all divs are hidden.
                harmony.hide.group('TSTGRP01');
                var set = $('.TSTGRP01');
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
                var el = $('#h-ad-2')[0];
                expect(el.style.display).toEqual('none');
                el = $('#h-ad-1')[0];
                expect(el.style.display).not.toEqual('none');
            });
        });
    });
});
