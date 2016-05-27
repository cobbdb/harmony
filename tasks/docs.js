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
        },
        template: {
            readme: {
                options: {
                    data: {
                        version: version
                    }
                },
                files: {
                    'readme.md': 'tasks/build-docs/readme.tpl'
                }
            }
        }
    });
};
