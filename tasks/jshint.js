module.exports = function (grunt) {
    grunt.config.merge({
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
                    'src/**/*.js',
                    'gruntfile.js',
                    'tests/**/*.spec.js',
                    'tasks/**/*.js'
                ]
            }
        }
    });
};
