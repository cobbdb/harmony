describe('v2/adslot.js', function () {
    var opts, pubads;
    spyOn(window, 'Lumberjack').and.returnValue(
        jasmine.createSpy('logSpy');
    });
    beforeEach(function () {
        // Reset the model.
        opts = {
            name: '',
            id: '',
            sizes: [],
            adunit: '',
            targeting: {},
            mapping: [],
            companion: false,
            breakpoint: '',
            interstitial: false,
            callback: function () {}
        };
        // Mock the pubads service.
        pubadsSpy = jasmine.createSpyObj('pubads', [
            'addEventListener'
        ]);
        // Mock the googletag object.
        googletag = jasmine.createSpyObj('googletag', [
            'defineOutOfPageSlot',
            'defineSlot',
            'companionAds'
        ]);
        // Mock the slot constructors.
        googletag.defineOutOfPageSlot.and.returnValue(jasmine.createSpyObj('outOfPageSlotSpy', [
            'setTargeting',
            'defineSizeMapping',
            'addService'
        ]));
        googletag.defineSlot.and.returnValue(jasmine.createSpyObj('slotSpy', [
            'setTargeting',
            'defineSizeMapping',
            'addService'
        ]));
    });

    describe('ad slot type', function () {
        it('can be standard', function () {
            opts.adunit = 'test/ad/unit';
            opts.id = 'test-id';
            opts.sizes = [100, 200];
            opts.interstitial = false;
            var slot = AdSlot(pubadsSpy, opts);
            expect(googletag.defineSlot).toHaveBeenCalledWith('test/ad/unit', [100, 200], 'test-id');
            expect(googletag.defineOutOfPageSlot).not.toHaveBeenCalled();
        });
        it('can be interstitial', function () {
            opts.adunit = 'test/ad/unit';
            opts.id = 'test-id';
            opts.interstitial = true;
            var slot = AdSlot(pubadsSpy, opts);
            expect(googletag.defineOutOfPageSlot).toHaveBeenCalledWith('test/ad/unit', 'test-id');
            expect(googletag.defineSlot).not.toHaveBeenCalled();
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
        var slot = AdSlot(pubadsSpy, opts);
        expect(slot.setTargeting).toHaveBeenCalledWith('single', 'target');
        expect(slot.setTargeting).toHaveBeenCalledWith('group', [
            'targ',
            'eting'
        ]);
    });

    it('exposes layout info', function () {
        opts.id = 'testid';
        opts.breakpoint = 'testpoint';
        var slot = AdSlot(pubadsSpy, opts);
        expect(slot.div_id).toEqual('testid');
        expect(slot.breakpoint).toEqual('testpoint');
    });

    describe('size mapping', function () {
        it('defaults to empty array', function () {
            var slot = AdSlot(pubadsSpy, opts);
            expect(slot.defineSizeMapping).toHaveBeenCalledWith([]);
        });
        it('can be applied', function () {
            opts.mapping = [12, 34];
            var slot = AdSlot(pubadsSpy, opts);
            expect(slot.defineSizeMapping).toHaveBeenCalledWith([12, 34]);
        });
    });

    describe('events', function () {
        it('can be bound via on()', function () {
            var slot = AdSlot(pubadsSpy, opts);
            expect(slot.on).toBeDefined();
        });
        it('can be of any type', function () {
            expect(function () {
                var slot = AdSlot(pubadsSpy, opts);
                var cb = jasmine.createSpy('renderSpy');
                slot.on('testEvent', cb);
            }).not.toThrowError();
        });
        describe('slotRenderEnded', function () {
            var trigger;
            beforeEach(function () {
                pubadsSpy.addEventListener.and.callFake(function (event, cb) {
                    trigger = cb;
                });
            });
            it('can be attached during construction', function () {
                opts.callback = jasmine.createSpy('renderSpy');
                var slot = AdSlot(pubadsSpy, opts);
                var spy = jasmine.createSpy('cbSpy');
                spy.slot = slot;
                trigger(spy);
                expect(opts.callback).toHaveBeenCalled();
            });
            it('can be attached with on()', function () {
                var slot = AdSlot(pubadsSpy, opts);
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
            var slot = AdSlot(pubadsSpy, opts);
            expect(slot.addService.calls.count()).toEqual(1);
            expect(slot.addService).toHaveBeenCalledWith(pubadsSpy);
            expect(googletag.companionAds).not.toHaveBeenCalled();
            expect(slot.addService).not.toHaveBeenCalledWith(compSpy);
        });
        it('can additionally be companionAds', function () {
            opts.companion = true;
            var compSpy = jasmine.createSpy('companion');
            googletag.companionAds.and.returnValue(compSpy);
            var slot = AdSlot(pubadsSpy, opts);
            expect(slot.addService.calls.count()).toEqual(2);
            expect(googletag.companionAds).toHaveBeenCalled();
            expect(slot.addService).toHaveBeenCalledWith(pubadsSpy);
            expect(slot.addService).toHaveBeenCalledWith(compSpy);
        });
    });
});
