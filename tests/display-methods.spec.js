describe('display method', function () {
    beforeEach(function () {
        setupHarmony();
        harmony.load(conf);
    });
    describe('harmony.show', function () {
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
    describe('harmony.hide', function () {
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
                expect(set[0].style.display).toEqual('none');
                expect(set[1].style.display).toEqual('none');
                set = $('.TSTPNT01');
                expect(set.length).toEqual(1);
                expect(set[0].style.display).not.toEqual('none');
            });
        });
        describe('slot()', function () {
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
