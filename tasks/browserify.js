module.exports = function (grunt) {
    grunt.config.merge({
        browserify: {
            global: {
                files: {
                    'bin/harmony.js': 'src/harmony.js'
                },
                options: {
                    browserifyOptions: {
                        standalone: 'Harmony'
                    }
                }
            },
            tests: {
                files: {
                    'bin/tests/harmony.js': 'src/harmony.js',
                    'bin/tests/adslot.js': 'src/adslot.js',
                    'bin/tests/log.js': 'src/log.js'
                },
                options: {
                    browserifyOptions: {
                        standalone: 'Test'
                    }
                }
            }
        }
    });
};
