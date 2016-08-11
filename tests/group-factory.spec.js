var GroupFactory = require('../src/modules/group-factory.js');

describe('GroupFactory', function () {
    describe('create()', function () {
        it('creates new groups', function () {
            var group = GroupFactory.create('test-group');
            expect(group.length()).toBe(0);
        });
        it('fetches existing groups', function () {
            var group = GroupFactory.create('test-group');
            var nextGroup = GroupFactory.create('test-group');
            expect(nextGroup).toBe(group);
        });
    });
    describe('clear()', function () {
        it('removes all existing groups', function () {
            var group = GroupFactory.create('test-group');
            expect(group.length()).toBe(0);

            group.add({
                name: 'test-slot'
            });
            expect(group.length()).toBe(1);

            group = GroupFactory.create('test-group');
            expect(group.length()).toBe(1);

            GroupFactory.clear();
            group = GroupFactory.create('test-group');
            expect(group.length()).toBe(0);
        });
    });
});
