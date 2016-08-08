/**
 * # Screen
 * Viewport size utility.
 */
module.exports = {
    /**
     * ## screen.width()
     * @return {Number} Width of the viewport.
     */
    width: function () {
        return (
            global.innerWidth ||
            global.document.documentElement.clientWidth ||
            global.document.body.clientWidth
        );
    },
    /**
     * ## screen.height()
     * @return {Number} Height of the viewport.
     */
    height: function () {
        return (
            global.innerHeight ||
            global.document.documentElement.clientHeight ||
            global.document.body.clientHeight
        );
    }
};
