var harmony = require('../src/harmony.js'),
    Help = require('./helpers/construction.helper.js'),
    Options = require('./helpers/slot-options.helper.js'),
    $ = require('jquery');

require('./helpers/slot.setup.js');

describe('harmony.defineSlot()', function () {
    var newConf = function () {
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
    beforeEach(function () {
        harmony.log.enable();
        harmony.log.clear();
    });
    it('creates an ad slot', function () {
        var opts = newSlot();
        harmony.defineSlot(opts);
        expect(harmony.slot('TST22').group).toEqual('GRP22');
        expect(harmony.group('GRP22').get('TST22').id).toEqual('DVID22-h1');
    });
    it('handles duplicate slots', function () {
        harmony.defineSlot(newSlot());
        harmony.defineSlot(newSlot());
        harmony.defineSlot(newSlot());
        harmony.defineSlot(newSlot());
        expect(harmony.slot('TST22').name).toEqual('TST22');
        expect(harmony.slot('TST22').id).toEqual('DVID22-h4');
    });
    it('logs missing dom elements', function () {
        var opts = newSlot();
        opts.id = 'NOTHERE';
        harmony.defineSlot(opts);
        expect(harmony.slot('TST22').mock).toBe(true);
        var errors = harmony.log.readback('error');
        expect(errors.length).toEqual(1);
        expect(errors[0].data.conf.name).toEqual('TST22');
        expect(errors[0].data.conf.id).toEqual('NOTHERE');
    });
});
