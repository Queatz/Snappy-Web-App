System.config({
    baseURL: './',
    map: {
        '@angular': 'node_modules/@angular'
    },
    packages: {
        app: {
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: 'bundles/platform-browser.umd.min.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser-dynamic': {
            main: 'bundles/platform-browser-dynamic.umd.min.js',
            defaultExtension: 'js'
        },
        '@angular/compiler': {
            main: 'bundles/compiler.umd.min.js',
            defaultExtension: 'js'
        },
        '@angular/core': {
            main: 'bundles/core.umd.min.js',
            defaultExtension: 'js'
        },
        '@angular/common': {
            main: 'bundles/common.umd.min.js',
            defaultExtension: 'js'
        },
        '@angular/router': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/http': {
            main: 'bundles/http.umd.min.js',
            defaultExtension: 'js'
        }
    }
});