var fs = require('fs');

module.exports = function (grunt) {
    grunt.config.merge({
        browserify: {
            global: {
                files: {
                    'bin/harmony.js': 'src/harmony.js'
                },
                options: {
                    browserifyOptions: {
                        standalone: 'Harmony'
                    }
                }
            },
            tests: {
                // Build map of built spec files.
                files: fs.readdirSync('../tests').reduce(function (prev, cur) {
                    prev['bin/tests/' + cur] = 'tests/' + cur;
                    return prev;
                }, {});
            }
        }
    });
};
