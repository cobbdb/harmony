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
        exec: {
            clone: {
                cmd: 'git clone ssh://vcs.ddtc.cmgdigital.com/git-repos/adgeletti.git -b cmg-pages docs-clone'
            },
            clear: {
                cmd: 'rm -rf docs-clone/*'
            },
            docker: {
                cmd: 'node_modules/.bin/docker -i src -o docs-clone'
            },
            add: {
                cmd: 'git --git-dir=docs-clone/.git --work-tree=docs-clone add -A'
            },
            commit: {
                cmd: "git --git-dir=docs-clone/.git --work-tree=docs-clone commit -m 'docs-bld'"
            },
            push: {
                cmd: 'git --git-dir=docs-clone/.git --work-tree=docs-clone push -f origin cmg-pages'
            },
            clean: {
                cmd: 'rm -rf docs-clone'
            }
        },
        'docker-clone': {
            build: {
                inpath: 'src/v2/*.js',
                branch: 'cmg-pages'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-docker-clone');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', [
        'jshint',
        'uglify',
        'jasmine'
    ]);

    grunt.registerTask('build', [
        'default',
        'docs'
    ]);

    grunt.registerTask('docs', [
        'exec:clone',
        'exec:clear',
        'exec:docker',
        'exec:add',
        'exec:commit',
        'exec:push',
        'exec:clean'
    ]);
};
