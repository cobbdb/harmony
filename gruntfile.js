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
                'dist/harmony.min.js': [
                    'src/v2/*.js',
                    'src/v1/*.js'
                ],
                options: {
                    enclose: {}
                }
            }
        },
        jasmine: {
            dist: {
                src: 'dist/*.js'
            },
            dev: {
                src: 'src/v2/*.js'
            },
            options: {
                specs: 'tests/*.spec.js',
                //vendor: resolve('jquery')
            }
        },
        'docker-clone': {
            build: {
                dir: 'src/v2',
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
        'uglify',
        'jasmine'
    ]);

    grunt.registerTask('build', [
        'default',
        'docker-clone:build'
    ]);
};
