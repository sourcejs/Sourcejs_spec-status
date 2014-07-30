module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Tasks
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ["assets/css/less"]
                },
                files: {
                    "assets/css/specStatus.css": "assets/css/less/specStatus.less"
                }
            }
        },

        watch: {
            less: {
                files: ['assets/css/less/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.registerTask('default', ['less']);
    grunt.registerTask('watch-css', ['default','watch']);
};
