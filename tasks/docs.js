module.exports = function (grunt) {
    var version = require('../package.json').version;
    grunt.config.merge({
        exec: {
            'build-docs-win': {
                cmd: 'call tasks/build-docs ' + version
            }
        }
    });
};
