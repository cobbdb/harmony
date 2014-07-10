module.exports = function (grunt) {
    grunt.config.merge({
        watch: {
            default: {
                files: [
                    'src/**/*.js',
                    'tests/*.spec.js'
                ],
                tasks: [
                    'jasmine'
                ]
            }
        }
    });
};
