module.exports = function (grunt) {
    grunt.config.merge({
        uglify: {
            build: {
                files: {
                    'dist/harmony.min.js': [
                        'src/log.js',
                        'src/adslot.js',
                        'src/harmony.js',
                        'src/v1/adgeletti.js'
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
