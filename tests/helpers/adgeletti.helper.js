/**
 * Stomp out the adgeletti nastiness.
 */
beforeEach(function () {
    Adgeletti = jasmine.createSpyObj('adgelettiSpy', [
        'position',
        'display',
        'hide'
    ]);
});
