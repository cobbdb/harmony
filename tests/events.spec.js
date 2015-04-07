var Harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Options = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('Events', function () {
    var harmony = Harmony({
        forceLog: true
    });
    it('can cache ahead of definition', function (done) {
        var slot = harmony.slot('new1');
        expect(slot.mock).toBe(true);
        slot.on('evt', function (num) {
            expect(num).toEqual(321);
            done();
        });
        var opts = Options({
            id: 'newid',
            name: 'new1'
        });
        Help.createDiv({
            id: 'newid'
        });
        harmony.defineSlot(opts);
        slot = harmony.slot('new1');
        expect(slot.mock).toBeUndefined();
        slot.trigger('evt', 321);
    });
    it('can be defined with slots', function (done) {
        Help.createDiv({
            id: 'newid'
        });
        harmony.defineSlot(Options({
            id: 'newid',
            name: 'new1',
            on: {
                evt1: function (num) {
                    expect(num).toEqual(321, 'on()');
                }
            },
            one: {
                evt1: function (num) {
                    expect(num).toEqual(321, 'one()');
                },
                evt2: function (num) {
                    expect(num).toEqual(123, 'one()');
                    done();
                }
            }
        }));
        var slot = harmony.slot('new1');
        slot.trigger('evt1', 321);
        slot.trigger('evt2', 123);
    });
    it('can be eager', function (done) {
        Help.createDiv({
            id: 'newid'
        });
        harmony.defineSlot(Options({
            id: 'newid',
            name: 'new1'
        }));
        var slot = harmony.slot('new1');
        slot.on('evt1', function (num) {
            expect(num).toEqual(321, 'on()');
        });
        slot.trigger('evt1', 321);
        slot.trigger('evt2', 123);
        slot.one('evt2', function (num) {
            expect(num).toEqual(123, 'one()');
            done();
        });
    });
    it('can be lazy', function (done) {
        Help.createDiv({
            id: 'newid'
        });
        harmony.defineSlot(Options({
            id: 'newid',
            name: 'new1'
        }));
        var slot = harmony.slot('new1'),
            called = false;
        slot.trigger('evt1');
        slot.trigger('evt2', 123);
        slot.on('evt1', function () {
            called = true;
        }, true);
        slot.one('evt2', function (num) {
            expect(called).toBe(false);
            expect(num).toEqual(123, 'one()');
            done();
        });
    });
    it('can trigger always or once', function () {
        Help.createDiv({
            id: 'newid'
        });
        harmony.defineSlot(Options({
            id: 'newid',
            name: 'new1'
        }));
        var slot = harmony.slot('new1'),
            count1 = 0,
            count2 = 0;
        slot.on('evt1', function () {
            count1 += 1;
        }, true);
        slot.one('evt2', function () {
            count2 += 1;
        });
        slot.trigger('evt1');
        slot.trigger('evt1');
        slot.trigger('evt2');
        slot.trigger('evt2');
        expect(count1).toEqual(2);
        expect(count2).toEqual(1);
    });
    it('can be turned off', function () {
        Help.createDiv({
            id: 'newid'
        });
        harmony.defineSlot(Options({
            id: 'newid',
            name: 'new1'
        }));
        var slot = harmony.slot('new1'),
            count1 = 0,
            count2 = 0;
        slot.on('evt1', function () {
            count1 += 1;
        }, true);
        slot.one('evt2', function () {
            count2 += 1;
        });
        slot.off('evt2');
        slot.trigger('evt1');
        slot.trigger('evt2');
        expect(count1).toEqual(1, 'first');
        expect(count2).toEqual(0, 'first');
        slot.off('evt1');
        slot.trigger('evt1');
        slot.trigger('evt2');
        expect(count1).toEqual(1, 'last');
        expect(count2).toEqual(0, 'last');
    });
});
