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
                        resolve('lumberjack'),
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
                summary: true
            }
        },
        'docker-clone': {
            build: {
                dir: 'src',
                branch: 'cmg-pages'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-docker-clone');

    grunt.registerTask('default', [
        'jshint',
        'uglify:build',
        'jasmine:dist'
    ]);

    grunt.registerTask('build', [
        'default',
        'docker-clone'
    ]);
};
