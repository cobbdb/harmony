module.exports = function (grunt) {
    // Load all grunt NPM tasks.
    require('matchdep').filterDev([
        'grunt-*',
        '!grunt-template-*'
    ]).forEach(grunt.loadNpmTasks);
    // Load harmony task confs.
    grunt.loadTasks('tasks');

    grunt.registerTask('build', 'Build distributable without tests.', [
        'browserify:global',
        'uglify:build'
    ]);
    grunt.registerTask('default', 'Full build suite.', [
        'browserify',
        'jasmine:modules',
        'jshint',
        'uglify:build',
        'jasmine:global'
    ]);
    grunt.registerTask('test', 'Run tests.', [
        'browserify:tests',
        'jasmine:modules'
    ]);
    grunt.registerTask('docs', 'Build and deploy autodocs.', [
        'docker-clone'
    ]);

    /**
     * To build docs:
     * $ git checkout git@github.com:cobbdb/harmony.git docs-clone
     * $ cd docs-clone
     * $ git checkout gh-pages
     * $ rm *
     * $ cd ..
     * $ docker -i src -o docs-clone
     * $ cd docs-clone
     * $ copy harmony.js.html index.html
     */
};
