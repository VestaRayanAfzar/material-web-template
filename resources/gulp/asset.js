var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    imageop = require('gulp-image-optimization'),
    inline = require('gulp-inline-angular-templates');

module.exports = function (dir, setting) {

    var tmpDirectory = dir.build + '/tmp/img';

    gulp.task('asset:html', function () {
        var rootStream = gulp.src(dir.src + '/*.html');
        var stream = gulp.src(dir.src + '/app/templates/**/*.html');
        if (setting.production) {
            rootStream = minifyHtml(rootStream).on('error', setting.error);
            stream = minifyHtml(stream).on('error', setting.error);
        }
        rootStream.pipe(gulp.dest(dir.buildWeb));
        return stream.pipe(gulp.dest(dir.buildWeb + '/tpl'));
    });

    gulp.task('asset:etc', function () {
        if (setting.production) {
            return gulp.src([dir.src + '/robots.txt', dir.src + '/sitemap.xml'])
                .pipe(gulp.dest(dir.buildWeb));
        }
    });

    gulp.task('asset:template', ['asset:html', 'asset:etc'], function () {
        gulp.src(dir.buildWeb + '/tpl/**/*.html')
         .pipe(inline('build/app/html/index.html', {
         base: 'build/app/html',
         method: 'append'
         }))
            .pipe(gulp.dest(dir.buildWeb));
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
        return stream.pipe(gulp.dest(dir.buildWeb + '/js/'));
    });

    gulp.task('asset:font', function () {
        return gulp.src([dir.src + '/fonts/**/*', dir.npm + '/material-design-icons/iconfont/*'])
            .pipe(gulp.dest(dir.buildWeb + '/fonts'));
    });

    gulp.task('asset:image', function () {
        gulp.src(dir.src + '/images/**/*')
            .pipe(gulp.dest(dir.buildWeb + '/img'));
    });

    gulp.task('asset:image:optimize', function () {
        var stream = gulp.src(dir.src + '/images/**/*');
        if (setting.production) {
         stream = stream.pipe(imageop({
                optimizationLevel: 5,
                progressive: true,
                interlaced: true
         })).on('error', setting.error);
        }
        return stream.pipe(gulp.dest(tmpDirectory));
    });

    gulp.task('asset:watch', function () {
        gulp.watch([dir.src + '/*.html', dir.src + '/app/templates/**/*.html'], ['asset:template']);
    });

    return {
        watch: ['asset:watch'],
        tasks: ['asset:template', 'asset:lib', 'asset:font', 'asset:image']
    };

    function minifyHtml(stream) {
        return stream.pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            keepClosingSlash: true
        }))
    }
};