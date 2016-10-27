const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const debug = require('gulp-debug');

gulp.task('delete_src', ()=>{
    return del(['src']);});

gulp.task('copy_src', ()=>{
    return gulp.src('../src/**/*', { since: gulp.lastRun('copy_src') })
            .pipe(debug())
            .pipe(gulp.dest('src'));})

gulp.task('es6', ()=>{
    return gulp.src('src/**/*.es6', { since: gulp.lastRun('copy_src') })
            .pipe(babel({ presets: ['es2015'] }))
            .pipe(gulp.dest('src'));});

gulp.task('copy_gulpfile_1', ()=>{
    return gulp.src('src/npm/gulpfile.js')
            .pipe(gulp.dest('../src/npm'));});

gulp.task('copy_gulpfile_2', ()=>{
    return gulp.src('src/npm/gulpfile.js')
            .pipe(gulp.dest('.'));});

gulp.task('copy', gulp.series('copy_src', 'es6', 'copy_gulpfile_1', 'copy_gulpfile_2'));
gulp.task('test', ()=>gulp.src('src/**/*test.js').pipe(ava({verbose: true})));
