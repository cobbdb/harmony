var semver = require('semver'),
    $ = require('curb');

module.exports = function (grunt) {
    grunt.registerTask('version', function (type, msg) {
        if (type && msg) {
            // Bump package.json version.
            var pkg = grunt.file.readJSON('package.json');
            pkg.version = semver.inc(pkg.version, type);
            grunt.file.write('package.json', JSON.stringify(pkg, null, 2));

            // Start the build process.
            grunt.config.set('exec', {
                'build-version-win': {
                    cmd: $('call tasks/version %s "%s"', pkg.version, msg)
                }
            });
            grunt.task.run('exec:build-version-win');
        } else {
            if (!type) {
                grunt.fail.fatal('Missing version type - major, minor, patch.\n\tgrunt version:<type>:<msg>');
            } else {
                grunt.fail.fatal('Missing git commit message.\n\tgrunt version:<type>:<msg>');
            }
        }
    });
};
