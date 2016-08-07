var cache = require('../modules/slot-cache.js'),
    stub = function () {};

module.exports = function (name) {
    return {
        mock: true,
        name: name,
        off: stub,
        on: cache(name).set.event,
        one: cache(name).set.single,
        setTargeting: cache(name).set.targeting,
        trigger: stub
    };
};
