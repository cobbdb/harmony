var Slot = require('../src/types/slot.js'),
    Options = require('./helpers/slot-options.helper.js'),
    Help = require('./helpers/construction.helper.js');

describe('Slot', function () {
    var opts;
    beforeEach(function () {
        opts = Options({
            id: 'test-id',
            group: 'test-grp'
        });
        Help.createDiv({
            id: 'test-id',
            group: 'test-grp'
        });
    });

    describe('type', function () {
        it('can be standard', function () {
            opts.adunit = 'test/ad/unit';
            opts.sizes = [100, 200];
            opts.interstitial = false;
            var slot = Slot(opts);
            expect(googletag.defineSlot).toHaveBeenCalledWith(
                'test/ad/unit',
                [100, 200],
                'test-id'
            );
            expect(googletag.defineOutOfPageSlot).not.toHaveBeenCalled();
        });
        it('can be out-of-page', function () {
            opts.adunit = 'test/ad/unit';
            opts.outofpage = true;
            var slot = Slot(opts);
            expect(googletag.defineSlot).not.toHaveBeenCalled();
            expect(googletag.defineOutOfPageSlot).toHaveBeenCalledWith(
                'test/ad/unit',
                'test-id'
            );
        });
    });

    it('applies slot-level targeting', function () {
        opts.targeting = {
            'single': 'target',
            'group': [
                'targ',
                'eting'
            ]
        };
        var slot = Slot(opts);
        expect(slot.gpt.setTargeting).toHaveBeenCalledWith('single', 'target');
        expect(slot.gpt.setTargeting).toHaveBeenCalledWith('group', [
            'targ',
            'eting'
        ]);
    });

    it('exposes layout info', function () {
        opts.sizes = [9, 4];
        opts.adunit = 'testunit';
        opts.name = 'testname';
        var slot = Slot(opts);
        expect(slot.id).toEqual('test-id');
        expect(slot.group).toEqual('test-grp');
        expect(slot.sizes).toEqual([9, 4]);
        expect(slot.adunit).toEqual('testunit');
        expect(slot.name).toEqual('testname');
    });

    describe('size mapping', function () {
        it('defaults to empty array', function () {
            var slot = Slot(opts);
            expect(slot.gpt.defineSizeMapping).toHaveBeenCalledWith([]);
        });
        it('can be applied', function () {
            opts.mapping = [12, 34];
            var slot = Slot(opts);
            expect(slot.gpt.defineSizeMapping).toHaveBeenCalledWith([12, 34]);
        });
    });

    describe('eventing', function () {
        it('uses jQuery naming conventions', function () {
            var slot = Slot(opts);
            expect(slot.on).toBeDefined();
            expect(slot.one).toBeDefined();
            expect(slot.off).toBeDefined();
            expect(slot.trigger).toBeDefined();
        });
        it('can be attached during construction', function (done) {
            opts.one = {
                slotRenderEnded: function (data) {
                    expect(data).toBe('test-data');
                    done();
                }
            };
            var slot = Slot(opts);
            slot.trigger('slotRenderEnded', 'test-data');
        });
        it('can be attached with on()', function (done) {
            var slot = Slot(opts);
            slot.on('slotRenderEnded', function (data) {
                expect(data).toBe('test-data');
                done();
            });
            slot.trigger('slotRenderEnded', 'test-data');
        });
    });

    it('does not add DFP services on creation', function () {
        var slot = Slot(opts);
        expect(slot.gpt.addService.calls.count()).toEqual(0);
    });
});
