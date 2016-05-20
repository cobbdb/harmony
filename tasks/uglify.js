module.exports = function (grunt) {
    grunt.config.merge({
        uglify: {
            build: {
                files: {
                    'dist/harmony.min.js': 'dist/harmony.js'
                }
            },
            options: {
                mangle: {
                    except: [
                        'googletag',
                        'Lumberjack'
                    ]
                }
            }
        }
    });
};
