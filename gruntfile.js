module.exports = function (grunt) {
    // Load all grunt NPM tasks.
    require('matchdep').filterDev([
        'grunt-*',
        '!grunt-template-*'
    ]).forEach(grunt.loadNpmTasks);
    // Load harmony task confs.
    grunt.loadTasks('tasks');

    grunt.registerTask('build', 'Build distributable without tests.', [
        'browserify:bundle',
        'uglify:bundle'
    ]);
    grunt.registerTask('default', 'Full build suite.', [
        'browserify',
        'jasmine:specBundles',
        'jshint',
        'uglify:bundle',
        'jasmine:bundle'
    ]);
    grunt.registerTask('test', 'Run tests.', [
        'browserify:specs',
        'jasmine:specBundles'
    ]);
    grunt.registerTask('docs', 'Build and deploy autodocs.', [
        'build-readme',
        'exec:build-docs-win-version',
        'exec:build-docs-win-main'
    ]);
};
