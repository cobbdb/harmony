var harmony, conf;
function setupHarmony() {
    harmony = Harmony();
    conf = {
        slots: [
            Options(),
            Options(),
            Options()
        ],
        targeting: {}
    };
}
