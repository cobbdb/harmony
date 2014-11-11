module.exports = function (grunt) {
    grunt.config.merge({
        browserify: {
            build: {
                files: {
                    'bin/harmony.js': [
                        'src/harmony.js'
                    ]
                }
            }
        }
    });
};
