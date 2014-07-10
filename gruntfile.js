module.exports = function (grunt) {
    // Load all grunt NPM tasks.
    require('matchdep').filterDev([
        'grunt-*',
        '!grunt-template-*'
    ]).forEach(grunt.loadNpmTasks);
    // Load harmony task confs.
    grunt.loadTasks('tasks');

    grunt.registerTask('default', 'Build without docs.', [
        'jshint',
        'uglify:build',
        'jasmine:src',
        'jasmine:dist'
    ]);
    grunt.registerTask('test', 'Run unit tests.', [
        'jasmine'
    ]);
    grunt.registerTask('build', 'Full build suite including docs.', [
        'default',
        'docker-clone'
    ]);
};
