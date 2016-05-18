var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    map = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify');

module.exports = function (dir, setting) {

    var tmpDirectory = dir.build + '/tmp/js';

    gulp.task('ts:compile', function () {
        var libSrc = dir.typescriptLibrary + '/**/*.ts';
        var tsFiles = [libSrc, dir.src + '/app/**/*.ts'];
        var stream = gulp.src(tsFiles);
        if (!setting.production) {
            stream = stream.pipe(map.init());
        }
        var tsResult = stream.pipe(ts({
            target: 'ES5',
            module: 'commonjs',
            removeComments: true
        }));
        if (setting.production) {
            tsResult = tsResult.js;
        } else {
            tsResult = tsResult.js.pipe(map.write());
        }
        return tsResult.pipe(gulp.dest(tmpDirectory));
    });

    gulp.task('ts:browserify', ['ts:compile'], function () {
        var stream = gulp.src(tmpDirectory + '/app.js')
            .pipe(browserify({
                insertGlobals: false,
                debug: !setting.production
            }));
        if (setting.production) {
            stream = stream.pipe(uglify());
        }
        return stream.pipe(gulp.dest(dir.buildWeb + '/js'))
    });

    gulp.task('ts:watch', function () {
        gulp.watch(dir.src + '/**/*.ts', ['ts:browserify']);
    });

    return {
        watch: ['ts:watch'],
        tasks: ['ts:browserify']
    };
};