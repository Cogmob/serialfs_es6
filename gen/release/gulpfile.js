'use strict';

var gulp = require('gulp');
var sequence = require('gulp-sequence');
var babel = require('gulp-babel');
var del = require('del');
var debug = require('gulp-debug');

gulp.task('delete_src', function () {
    return del(['src']);
});

gulp.task('copy_src', function () {
    return gulp.src('../../src/**/*').pipe(debug()).pipe(gulp.dest('src'));
});

gulp.task('es6', function () {
    return gulp.src('src/**/*.es6').pipe(babel({ presets: ['es2015'] })).pipe(gulp.dest('src'));
});

gulp.task('copy_gulpfile_1', function () {
    return gulp.src('src/npm/gulpfile.js').pipe(gulp.dest('../../src/npm'));
});

gulp.task('copy_gulpfile_2', function () {
    return gulp.src('src/npm/gulpfile.js').pipe(gulp.dest('.'));
});

gulp.task('build_dev', sequence('copy_src', 'es6', 'copy_gulpfile_1', 'copy_gulpfile_2'));
gulp.task('build_release', sequence('copy_src', 'es6'));