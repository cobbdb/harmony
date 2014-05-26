var resolve = require('bower-path');

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                curly: true,
                eqeqeq: false,
                indent: 4,
                noarg: true,
                nonew: false,
                plusplus: true,
                quotmark: false,
                trailing: true
            },
            default: {
                src: [
                    'src/*.js',
                    'gruntfile.js',
                    'tests/*.spec.js'
                ]
            }
        },
        watch: {
            default: {
                files: [
                    'src/**/*.js',
                    'tests/*.spec.js'
                ],
                tasks: [
                    'jasmine'
                ]
            }
        },
        uglify: {
            build: {
                files: {
                    'dist/harmony.min.js': [
                        'src/log.js',
                        'src/adslot.js',
                        'src/harmony.js',
                        'src/v1/adgeletti.js'
                    ]
                },
                options: {
                    enclose: {},
                    mangle: {
                        except: [
                            'googletag',
                            'Lumberjack'
                        ]
                    }
                }
            }
        },
        jasmine: {
            dist: {
                src: 'dist/*.js',
                options: {
                    specs: 'tests/harmony.spec.js'
                }
            },
            src: {
                src: [
                    'src/log.js',
                    'src/adslot.js',
                    'src/harmony.js'
                ],
                options: {
                    specs: 'tests/*.spec.js'
                }
            },
            options: {
                helpers: 'tests/helpers/*.helper.js',
                vendor: resolve('lumberjack'),
                display: 'short',
                summary: true,
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'bin/coverage/coverage.json',
                    report: {
                        type: 'text-summary'
                    }
                }
            }
        },
        'docker-clone': {
            build: {
                dir: 'src',
                branch: 'cmg-pages'
            }
        }
    });

    // Load all grunt NPM tasks.
    require('matchdep').filterDev([
        'grunt-*',
        '!grunt-template-*'
    ]).forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', [
        'jshint',
        'uglify:build',
        'jasmine:src',
        'jasmine:dist'
    ]);

    grunt.registerTask('build', [
        'default',
        'docker-clone'
    ]);
};
