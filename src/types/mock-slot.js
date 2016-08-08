var cache = require('../modules/slot-cache.js'),
    stub = function () {};

module.exports = function (name) {
    return {
        gpt: {
            setTargeting: cache(name).set.targeting
        },
        mock: true,
        name: name,
        off: stub,
        on: cache(name).set.event,
        one: cache(name).set.single,
        trigger: stub
    };
};
