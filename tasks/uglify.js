module.exports = function (grunt) {
    grunt.config.merge({
        uglify: {
            build: {
                files: {
                    'dist/harmony.min.js': [
                        'src/*.js'
                    ]
                },
                options: {
                    enclose: {},
                    mangle: {
                        except: [
                            'googletag',
                            'Lumberjack'
                        ]
                    }
                }
            }
        }
    });
};
