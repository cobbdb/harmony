var Util = require('../src/util.js');

describe('Util', function () {
    /**
     * --> None of this is done yet. VVV
     */

    var opts;
    beforeEach(function () {
        // Reset options model.
        opts = Options();
    });

    describe('type', function () {
        it('can be standard', function () {
            opts.adunit = 'test/ad/unit';
            opts.id = 'test-id';
            opts.sizes = [100, 200];
            opts.interstitial = false;
            var slot = AdSlot(DFP.spies.pubads, opts);
            expect(googletag.defineSlot).toHaveBeenCalledWith(
                'test/ad/unit',
                [100, 200],
                'test-id'
            );
            expect(googletag.defineOutOfPageSlot).not.toHaveBeenCalled();
        });
        it('can be interstitial', function () {
            opts.adunit = 'test/ad/unit';
            opts.id = 'test-id';
            opts.interstitial = true;
            var slot = AdSlot(DFP.spies.pubads, opts);
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
        var slot = AdSlot(DFP.spies.pubads, opts);
        expect(slot.setTargeting).toHaveBeenCalledWith('single', 'target');
        expect(slot.setTargeting).toHaveBeenCalledWith('group', [
            'targ',
            'eting'
        ]);
    });

    it('exposes layout info', function () {
        opts.id = 'testid';
        opts.breakpoint = 'testpoint';
        opts.sizes = [9, 4];
        opts.adunit = 'testunit';
        opts.name = 'testname';
        var slot = AdSlot(DFP.spies.pubads, opts);
        expect(slot.divId).toEqual('testid');
        expect(slot.breakpoint).toEqual('testpoint');
        expect(slot.sizes).toEqual([9, 4]);
        expect(slot.adunit).toEqual('testunit');
        expect(slot.name).toEqual('testname');
    });

    describe('size mapping', function () {
        it('defaults to empty array', function () {
            var slot = AdSlot(DFP.spies.pubads, opts);
            expect(slot.defineSizeMapping).toHaveBeenCalledWith([]);
        });
        it('can be applied', function () {
            opts.mapping = [12, 34];
            var slot = AdSlot(DFP.spies.pubads, opts);
            expect(slot.defineSizeMapping).toHaveBeenCalledWith([12, 34]);
        });
    });

    describe('events', function () {
        it('can be bound via on()', function () {
            var slot = AdSlot(DFP.spies.pubads, opts);
            expect(slot.on).toBeDefined();
        });
        it('can be of any type', function () {
            expect(function () {
                var slot = AdSlot(DFP.spies.pubads, opts);
                slot.on('testEvent', 'abc123');
                slot.on('testEvent', function () {});
            }).not.toThrowError();
        });
        describe('slotRenderEnded', function () {
            var trigger;
            beforeEach(function () {
                DFP.spies.pubads.addEventListener.and.callFake(
                    function (event, cb) {
                        trigger = cb;
                    }
                );
            });
            it('can be attached during construction', function () {
                opts.callback = jasmine.createSpy('renderSpy');
                var slot = AdSlot(DFP.spies.pubads, opts);
                var spy = jasmine.createSpy('cbSpy');
                spy.slot = slot;
                trigger(spy);
                expect(opts.callback).toHaveBeenCalled();
            });
            it('can be attached with on()', function () {
                var slot = AdSlot(DFP.spies.pubads, opts);
                var cb = jasmine.createSpy('renderSpy');
                slot.on('slotRenderEnded', cb);
                var spy = jasmine.createSpy('cbSpy');
                spy.slot = slot;
                trigger(spy);
                expect(cb).toHaveBeenCalled();
            });
        });
    });

    describe('services', function () {
        it('can be pubads', function () {
            opts.companion = false;
            var compSpy = jasmine.createSpy('companion');
            googletag.companionAds.and.returnValue(compSpy);
            var slot = AdSlot(DFP.spies.pubads, opts);
            expect(slot.addService.calls.count()).toEqual(1);
            expect(googletag.companionAds).not.toHaveBeenCalled();
            expect(slot.addService).toHaveBeenCalledWith(DFP.spies.pubads);
            expect(slot.addService).not.toHaveBeenCalledWith(compSpy);
        });
        it('can additionally be companionAds', function () {
            opts.companion = true;
            var compSpy = jasmine.createSpy('companion');
            googletag.companionAds.and.returnValue(compSpy);
            var slot = AdSlot(DFP.spies.pubads, opts);
            expect(slot.addService.calls.count()).toEqual(2);
            expect(googletag.companionAds).toHaveBeenCalled();
            expect(slot.addService).toHaveBeenCalledWith(DFP.spies.pubads);
            expect(slot.addService).toHaveBeenCalledWith(compSpy);
        });
    });
});
