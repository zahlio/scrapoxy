'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('test', function() {
    gulp.src([
        //paths.server + '/**/*.spec.js',
        //paths.e2e + '/**/*.spec.js'
        paths.e2e + '/**/scale.spec.js'
    ])
        .pipe($.mocha({
            reporter: 'spec'
        }))
        .pipe($.exit())
        .on('error', handleError)
});
