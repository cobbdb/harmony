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
                    'src/v2/*.js',
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
                        'src/v2/*.js',
                        'src/v1/*.js'
                    ]
                },
                options: {
                    enclose: {},
                    mangle: {
                        except: [
                            'googletag'
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
                src: 'src/v2/*.js'
            },
            options: {
                specs: 'tests/**/*.spec.js',
                helpers: 'tests/**/*.helper.js',
                vendor: resolve('jquery')
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
        'jasmine:src'
    ]);

    grunt.registerTask('build', [
        'default',
        'docker-clone'
    ]);
};
