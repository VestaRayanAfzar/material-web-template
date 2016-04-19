var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    map = require('gulp-sourcemaps');

module.exports = function (dir, setting) {

    gulp.task('staticServer:ts', function () {
        var libSrc = dir.typescriptLibrary + '/**/*.ts',
            stream = gulp.src([libSrc, dir.resource + '/static-server/**/*.ts']),
            genMap = !setting.production;
        if (genMap) stream = stream.pipe(map.init());
        var tsResult = stream.pipe(ts({
            target: 'ES5',
            module: 'commonjs',
            removeComments: true
        }));

        return (genMap ? tsResult.js : tsResult.js.pipe(map.write()))
            .pipe(gulp.dest(dir.build + '/static-server'));
    });

    gulp.task('staticServer:watch', function () {
        return gulp.watch(dir.resource + '/static-server/**/*.ts', ['staticServer:ts']);
    });

    return {
        watch: ['staticServer:watch'],
        tasks: ['staticServer:ts']
    };
};
