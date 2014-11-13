module.exports = function (grunt) {
    // Load all grunt NPM tasks.
    require('matchdep').filterDev([
        'grunt-*',
        '!grunt-template-*'
    ]).forEach(grunt.loadNpmTasks);
    // Load harmony task confs.
    grunt.loadTasks('tasks');

    grunt.registerTask('default', 'Full build suite.', [
        'jasmine:modules',
        'jshint',
        'uglify:build',
        'jasmine:global'
    ]);
    grunt.registerTask('test', 'Run tests.', [
        'jasmine'
    ]);
    grunt.registerTask('docs', 'Build and deploy autodocs.', [
        'docker-clone'
    ]);
};
