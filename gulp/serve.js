'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'open']
});

gulp.task('serve', function(args) {
    $.nodemon(paths.server + '/index.js');
});

gulp.task('debug', function(args) {
    $.nodemon('--debug=5858 ' + paths.server + '/index.js')
        .on('config:update', function() {
            setTimeout(function() {
                $.open('http://localhost:8080/debug?port=5858');
            }, 500);
        });
    gulp.src([])
        .pipe($.nodeInspector({
            webHost: 'localhost',
            saveLiveEdit: true,
            preload: false
        }));
});
