module.exports = function (grunt) {
    grunt.config.merge({
        uglify: {
            global: {
                files: {
                    'dist/global/harmony.min.js': [
                        'bin/harmony.js'
                    ]
                }
            },
            module: {
                files: {
                    'dist/module/harmony.js': [
                        'bin/harmony.js',
                        'src/module.wrap.js'
                    ]
                },
                options: {
                    enclose: {}
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
