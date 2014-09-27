var resolve = require('bower-path');
module.exports = function (grunt) {
    grunt.config.merge({
        jasmine: {
            dist: {
                src: 'dist/*.js',
                options: {
                    specs: [
                        'tests/*.spec.js'
                    ]
                }
            },
            src: {
                src: [
                    'src/*.js'
                ],
                options: {
                    specs: 'tests/**/*.spec.js'
                }
            },
            options: {
                helpers: 'tests/helpers/*.helper.js',
                vendor: [
                    resolve('lumberjack'),
                    resolve('jquery')
                ],
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
