var resolve = require('bower-path');
module.exports = function (grunt) {
    grunt.config.merge({
        jasmine: {
            global: {
                src: 'dist/harmony.min.js',
                options: {
                    specs: 'tests/global/harmony.spec.js'
                }
            },
            modules: {
                src: 'bin/tests/*.spec.js'
            },
            options: {
                display: 'full',
                summary: false,
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'bin/coverage/coverage.json',
                    report: {
                        type: 'text-summary'
                    }
                }
            }
        }
    });
};
