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
         * ### name
         * @type {string}
         */
        name: groupName,
        /**
         * ### length()
         * @return {!number}
         */
        length: function () {
            return slotList.length;
        },
        /**
         * ### add(slot)
         * Add a new slot to this group.
         * @param {!Slot} slot
         * @see types/slot.js
         */
        add: function (slot) {
            slotList.push(slot);
            slotMap[slot.name] = slot;
        },
        /**
         * ### get(name)
         * Fetch a slot by name.
         * @param {string} name
         * @return {?Slot}
         */
        get: function (name) {
            return slotMap[name] || null;
        },
        /**
         * ### getAll()
         * *Danger Zone* Fetch all slots in this group.
         * @return {!Slot[]}
         */
        getAll: function () {
            return slotList;
        },
        /**
         * ### has(name)
         * @param {string} name
         * @return {!boolean}
         */
        has: function (name) {
            return name in slotMap;
        },
        /**
         * ### clear()
         * Remove all slots from this group.
         */
        clear: function () {
            slotList = [];
            slotMap = {};
        },
        /**
         * ### forEach(callback)
         * Iterate over the group of slots.
         * @param {?function(Slot)} cb
         * @see types/slot.js
         */
        forEach: function (cb) {
            cb = cb || function () {};
            slotList.forEach(cb);
        }
    };
};
