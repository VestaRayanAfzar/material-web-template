var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    imageop = require('gulp-image-optimization');

module.exports = function (dir, setting) {

    gulp.task('asset:template', function () {
        var stream = gulp.src(dir.src + '/app/templates/**/*.html');
        if (setting.production) {
            stream = stream.pipe(htmlmin({
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                keepClosingSlash: true
            }));
        }
        stream.pipe(gulp.dest(dir.build + '/tpl'));
        gulp.src(dir.src + '/index.html')
            .pipe(gulp.dest(dir.build));
    });

    gulp.task('asset:lib', function () {
        var libs = [
            dir.npm + '/jssha/src/sha.js',
            dir.npm + '/jquery-param/jquery-param.js',
            dir.npm + '/angular/angular.js',
            dir.npm + '/angular-animate/angular-animate.js',
            dir.npm + '/angular-aria/angular-aria.js',
            dir.npm + '/angular-messages/angular-messages.js',
            dir.npm + '/angular-ui-router/release/angular-ui-router.js',
            dir.npm + '/angular-material/angular-material.js',
            dir.npm + '/angular-material-data-table/dist/md-data-table.js'
        ];
        var stream = gulp.src(libs).pipe(concat('lib.js'));
        if (setting.production) {
            stream = stream.pipe(uglify());
        }
        return stream.pipe(gulp.dest(dir.build + '/js/'));
    });

    gulp.task('asset:font', function () {
        return gulp.src([dir.src + '/fonts/*', dir.npm + '/material-design-icons/iconfont/*'])
            .pipe(gulp.dest(dir.build + '/fonts'));
    });

    gulp.task('asset:image', function () {
        var stream = gulp.src(dir.src + '/images/**/*');
        if (setting.production) {
            stream.pipe(imageop({
                optimizationLevel: 5,
                progressive: true,
                interlaced: true
            }));
        }
        return stream.pipe(gulp.dest(dir.build + '/img'));
    });

    gulp.task('asset:watch', function () {
        gulp.watch([dir.src + '/index.html', dir.src + '/app/templates/**/*.html'], ['asset:template']);
    });

    return {
        watch: ['asset:watch'],
        tasks: ['asset:template', 'asset:lib', 'asset:font', 'asset:image']
    };
};