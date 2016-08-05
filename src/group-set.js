/**
 * # Slot-Group Set
 */

var groups = {};

module.exports = {
    /**
     * ## set.get(name)
     * Fetch a group by name.
     * @param {String} name Name of the group.
     * @return {Array} Collection of 0 or more ad slots.
     */
    get: function (name) {
        return groups[name] || [];
    },
    /**
     * ## set.add(name, slot)
     * Add a slot to a group.
     * @param {Slot} slot Ad slot to add to the group.
     * @return {Array} Collection of 0 or more ad slots.
     */
    add: function (name, slot) {
        groups[name] = groups[name] || [];
        groups[name].push(slot);
        return groups[name];
    },
    /**
     * ## set.clear()
     * Reset the collection.
     */
    clear: function () {
        groups = {};
    }
};
