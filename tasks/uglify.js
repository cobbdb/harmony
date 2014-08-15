module.exports = function (grunt) {
    grunt.config.merge({
        uglify: {
            build: {
                files: {
                    'dist/harmony.min.js': [
                        'src/adslot.js',
                        'src/harmony.js'
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
