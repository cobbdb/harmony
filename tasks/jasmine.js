var $ = require('curb');

module.exports = function (grunt) {
    grunt.config.merge({
        jasmine: {
            global: {
                src: 'dist/harmony.min.js',
                options: {
                    specs: 'tests/global/*.spec.js'
                }
            },
            modules: {
                src: $('bin/tests/%s.spec.js',
                    grunt.option('spec') || '*'
                )
            },
            options: {
                display: 'full',
                summary: false
            }
        }
    });
};
