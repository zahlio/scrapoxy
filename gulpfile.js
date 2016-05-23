'use strict';

const gulp = require('gulp'),
    path = require('path'),
    winston = require('winston');

const $ = require('gulp-load-plugins')({
    pattern: ['gulp-*'],
});


const paths = {
    server: 'server',
    e2e: 'e2e',
};


gulp.task('lint',
    () => gulp.src([
        path.join(paths.server, '/**/*.js'),
        path.join(paths.e2e, '/**/*.js'),
        'gulpfile.js',
        '!node_modules/**',
        '!server/proxies/commander/public/**',
    ])
        .pipe($.eslint())
        .pipe($.eslint.format())
);


gulp.task('test', () => {
    winston.level = 'debug';

    gulp.src([
        path.join(paths.server, '/**/*.spec.js'),
        //path.join(paths.e2e, '/**/*.spec.js'),
    ])
        .pipe($.mocha({
            reporter: 'spec',
        }))
        .on('error', handleError)
        .pipe($.exit());
});


////////////

function handleError(err) {
    winston.error(err);

    this.emit('end');
}
