describe('log tool', function () {
    var output = '';
    beforeEach(function () {
        spyOn(console, 'log').and.callFake(function (msg) {
            output = msg;
        });
        var clean = delete localStorage.noisy;
        expect(clean).toBe(true);
        expect(localStorage.noisy).toBeUndefined();
    });
    afterEach(function () {
        log.flush();
        output = '';
    });

    it('does not throw errors', function () {
        expect(function () {
            log('test msg');
            log();
            log.flush();
        }).not.toThrowError();
    });
    it('accepts entries', function () {
        var out = log('abc123');
        expect(out).toBeUndefined();
    });
    it('repeats entries', function () {
        log('abc123');
        log();
        expect(output).toEqual('> abc123\n');
    });
    it('can flush entries', function () {
        log('racecar');
        var out = log.flush();
        expect(output).toEqual('> racecar\n');
        expect(out).toEqual('> racecar\n');
        log();
        expect(output).toEqual('');
    });
});
