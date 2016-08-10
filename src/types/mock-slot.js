var SlotCache = require('../modules/slot-cache.js'),
    stub = function () {};

module.exports = function (name) {
    var cache = SlotCache(name);
    return {
        gpt: {
            setTargeting: cache.set.targeting
        },
        mock: true,
        name: name,
        off: stub,
        on: cache.set.event,
        one: cache.set.single,
        trigger: stub
    };
};
