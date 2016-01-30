module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        systemjs: {
            options: {
                baseURL: "./",
                sfx: true,
                configFile: './config.js',
                minify: true,
                build: {
                    mangle: true
                },
                sourceMaps: false
            },
            dist: {
                files: [{
                    src: './app/boot.js',
                    dest: './dist/app/boot.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-systemjs-builder');

    grunt.registerTask('default', ['systemjs']);

};