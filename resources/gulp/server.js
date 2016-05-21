var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    map = require('gulp-sourcemaps'),
    fse = require('fs-extra');

module.exports = function (dir, setting) {

    gulp.task('server:ts', function () {
        var libSrc = dir.typescriptLibrary + '/**/*.ts',
            stream = gulp.src([libSrc, dir.server + '/**/*.ts']),
            genMap = !setting.production;
        if (genMap) stream = stream.pipe(map.init());
        var tsResult = stream.pipe(ts({
            target: 'ES5',
            module: 'commonjs',
            removeComments: true
        }));

        fse.copySync(dir.server + '/package.json', dir.buildServer + '/package.json');

        return (genMap ? tsResult.js : tsResult.js.pipe(map.write()))
            .pipe(gulp.dest(dir.buildServer));
    });

    gulp.task('server:watch', function () {
        return gulp.watch(dir.server + '/**/*.ts', ['server:ts']);
    });

    return {
        watch: ['server:watch'],
        tasks: ['server:ts']
    };
};
