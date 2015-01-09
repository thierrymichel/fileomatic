/*jslint browser: true, devel: true */
"use strict";

/*
 * Load modules / packages
 */

var gulp = require('gulp'),
    Notifier = require('node-notifier'),
    autoprefixer = require('gulp-autoprefixer'),
    debug = require('gulp-debug'),
    notify = require('gulp-notify'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    webserver = require('gulp-webserver');

var NotificationCenter = require('node-notifier').NotificationCenter;



/*
 * Settings
 */

var paths = {
    styles: {
        src: 'dev/scss/main.scss',
        files: 'dev/scss/**/*.scss',
        dest: 'public/css/',
        main: 'main.css'
    }
};



/*
 * DEV main task (default)
 */

gulp.task('default', ['webserver', 'styles', 'watch'], function () {
    var notification = new NotificationCenter();
    notification.notify({
        title: 'Gulp notification',
        message: 'DEFAULT task COMPLETE!'
    });
});

// DEV: enable livereload
// Listen to static files, main script and styles files
gulp.task('webserver', function () {
    gulp
        .src([
            'public/css/'
        ])
        .pipe(webserver({
            livereload: {
                enable: true
            }
        }));
});

// ALL: Sass compilation + autoprefixer
gulp.task('styles', function () {
    return sass(paths.styles.src, {sourcemap: true, style: 'compact'})
        // .pipe(debug({verbose: true}))
        .pipe(autoprefixer(
            'last 2 versions',
            '> 5%',
            'ie >= 9',
            'Firefox ESR'
        ))
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: '../scss'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(notify({
            onLast: true,
            message: 'STYLES task SUCCESS!',
            icon: null
        }));
});

// DEV: watch for styles changes
gulp.task('watch', function () {
    gulp.watch(paths.styles.files, ['styles']);
});
