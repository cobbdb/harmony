/**
 * # Slot Group
 * A collection of Slots.
 * @constructor
 * @param {string} [groupName]
 * @return {!Group}
 */
module.exports = function (groupName) {
    var slotList = [],
        slotMap = {};

    /**
     * ## group
     * @type {Group}
     */
    return {
        /**
         * ## group.name
         * @type {string}
         */
        name: groupName,
        /**
         * ## group.length()
         * @return {!number}
         */
        length: function () {
            return slotList.length;
        },
        /**
         * ## group.add(slot)
         * Add a new slot to this group.
         * @param {!Slot} slot
         */
        add: function (slot) {
            slotList.push(slot);
            slotMap[slot.name] = slot;
        },
        /**
         * ## group.get(name)
         * Fetch a slot by name.
         * @param {string} name
         * @return {?Slot}
         */
        get: function (name) {
            return slotMap[name] || null;
        },
        /**
         * ## group.getAll()
         * *Danger Zone* Fetch all slots in this group.
         * @return {!Slot[]}
         */
        getAll: function () {
            return slotList;
        },
        /**
         * ## group.has(name)
         * @param {string} name
         * @return {!boolean}
         */
        has: function (name) {
            return name in slotMap;
        },
        /**
         * ## group.clear()
         * Remove all slots from this group.
         */
        clear: function () {
            slotList = [];
            slotMap = {};
        },
        /**
         * ## group.forEach(callback)
         * Iterate over the group of slots.
         * @param {?function(Slot)} cb
         */
        forEach: function (cb) {
            cb = cb || function () {};
            slotList.forEach(cb);
        }
    };
};
