module.exports = function (grunt) {
    var version = require('../package.json').version;
    grunt.config.merge({
        exec: {
            'build-docs-win-version': {
                cmd: 'call tasks/build-docs ' + version
            },
            'build-docs-win-main': {
                cmd: 'call tasks/build-docs .'
            }
        }
    });
    grunt.registerTask('build-readme', function () {
        var readme = grunt.file.read('tasks/build-docs/readme.tpl');
        readme = grunt.template.process(readme, {
            data: {
                version: version
            }
        });
        grunt.file.write('readme.md', readme);
    });
};
