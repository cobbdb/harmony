module.exports = function (grunt) {
    grunt.config.merge({
        exec: {
            'build-docs-win': {
                cmd: 'call tasks/build-docs'
            }
        }
    });
};
