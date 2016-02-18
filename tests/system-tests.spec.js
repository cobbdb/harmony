var Harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Options = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

describe('System test', function () {
    it('dynamic page content', function () {
        var harmony = Harmony({
                forceLog: true
            }),
            newConf = function () {
                return Options({
                    name: 'TST22',
                    group: 'GRP22',
                    id: 'DVID22'
                });
            },
            newSlot = function () {
                var conf = newConf();
                Help.createDiv(conf);
                return conf;
            };
        // Create three new legitimate slots.
        harmony.defineSlot(newSlot());
        harmony.defineSlot(newSlot());
        harmony.defineSlot(newSlot());
        // Simulate an ad call.
        $('.GRP22').text('test ad content');
        // Create three slots missing dom elements.
        harmony.defineSlot(newConf());
        harmony.defineSlot(newConf());
        harmony.defineSlot(newConf());
        // Expect 3 error messages for failed DOM queries.
        expect(harmony.log.readback('error').length).toEqual(3);
        expect(harmony.slot('TST22').divId).toEqual('DVID22', 'group A, TST22');
        expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1', 'group A, TST22-h1');
        expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2', 'group A, TST22-h2');
        expect(harmony.slot('TST22-h3').divId).toBeUndefined('group A, TST22-h3');
        // Create a new empty legitimate slot.
        harmony.defineSlot(newSlot());
        expect(harmony.slot('TST22').divId).toEqual('DVID22', 'group B, TST22');
        expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1', 'group B, TST22-h1');
        expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2', 'group B, TST22-h2');
        expect(harmony.slot('TST22-h3').divId).toEqual('DVID22-h3', 'group B, TST22-h3');
        expect(harmony.slot('TST22-h4').divId).toBeUndefined('group B, TST22-h4');
        expect(harmony.slot('TST22-h5').divId).toBeUndefined('group B, TST22-h5');
        // Create a 2nd empty legitimate slot.
        harmony.defineSlot(newSlot());
        expect(harmony.slot('TST22').divId).toEqual('DVID22', 'group C, TST22');
        expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1', 'group C, TST22-1');
        expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2', 'group C, TST22-2');
        expect(harmony.slot('TST22-h3').divId).toEqual('DVID22-h3', 'group C, TST22-3');
        expect(harmony.slot('TST22-h4').divId).toEqual('DVID22-h4', 'group C, TST22-4');
        expect(harmony.slot('TST22-h5').divId).toBeUndefined('group C, TST22-h5');
        expect(harmony.slot('TST22-h6').divId).toBeUndefined('group C, TST22-h6');
    });
    it('dynamic page content with drone option', function () {
        var harmony = Harmony({
                forceLog: true
            }),
            newConf = function () {
                return Options({
                    name: 'TST22',
                    group: 'GRP22',
                    id: 'DVID22',
                    drone: true
                });
            },
            newSlot = function () {
                var conf = newConf();
                Help.createDiv(conf);
                return conf;
            };
        // Create three new legitimate slots.
        harmony.defineSlot(newSlot());
        harmony.defineSlot(newSlot());
        harmony.defineSlot(newSlot());
        // Simulate an ad call.
        $('.GRP22').text('test ad content');
        // Create three slots missing dom elements.
        harmony.defineSlot(newConf());
        harmony.defineSlot(newConf());
        harmony.defineSlot(newConf());
        // Expect 3 error messages for failed DOM queries.
        expect(harmony.log.readback('error').length).toEqual(3);
        expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1', 'group A, TST22-h1');
        expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2', 'group A, TST22-h2');
        expect(harmony.slot('TST22-h3').divId).toEqual('DVID22-h3', 'group A, TST22-h3');
        expect(harmony.slot('TST22-h4').divId).toBeUndefined('group A, TST22-h4');
        // Create a new empty legitimate slot.
        harmony.defineSlot(newSlot());
        expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1', 'group B, TST22-h1');
        expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2', 'group B, TST22-h2');
        expect(harmony.slot('TST22-h3').divId).toEqual('DVID22-h3', 'group B, TST22-h3');
        expect(harmony.slot('TST22-h4').divId).toEqual('DVID22-h4', 'group B, TST22-h4');
        expect(harmony.slot('TST22-h5').divId).toBeUndefined('group B, TST22-h5');
        expect(harmony.slot('TST22-h6').divId).toBeUndefined('group B, TST22-h6');
        // Create a 2nd empty legitimate slot.
        harmony.defineSlot(newSlot());
        expect(harmony.slot('TST22-h1').divId).toEqual('DVID22-h1', 'group C, TST22-h1');
        expect(harmony.slot('TST22-h2').divId).toEqual('DVID22-h2', 'group C, TST22-h2');
        expect(harmony.slot('TST22-h3').divId).toEqual('DVID22-h3', 'group C, TST22-h3');
        expect(harmony.slot('TST22-h4').divId).toEqual('DVID22-h4', 'group C, TST22-h4');
        expect(harmony.slot('TST22-h5').divId).toEqual('DVID22-h5', 'group C, TST22-h5');
        expect(harmony.slot('TST22-h6').divId).toBeUndefined('group C, TST22-h6');
        expect(harmony.slot('TST22-h7').divId).toBeUndefined('group C, TST22-h7');
    });
});
