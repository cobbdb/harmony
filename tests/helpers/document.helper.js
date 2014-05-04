var elemSpies;
beforeEach(function () {
    elemSpies = [];
    spyOn(document, 'getElementById').and.callFake(function (id) {
        var spy = jasmine.createSpyObj('elemSpy', [
            'style'
        ]);
        spy.id = id;
        elemSpies.push(spy);
        return spy;
    });
});
