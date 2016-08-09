module.exports = function (grunt) {
    grunt.config.merge({
        uglify: {
            bundle: {
                files: {
                    'dist/harmony.min.js': 'bin/harmony.js'
                }
            },
            options: {
                mangle: {
                    except: [
                        'googletag'
                    ]
                }
            }
        }
    });
};
