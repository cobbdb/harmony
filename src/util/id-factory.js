/**
 * # Id Factory
 */
module.exports = {
    curr: 0,
    next: function () {
        this.curr += 1;
        return this.curr;
    }
};
