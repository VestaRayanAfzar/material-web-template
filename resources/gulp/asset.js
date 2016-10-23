var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    // imageop = require('gulp-image-optimization'),
    inline = require('gulp-inline-angular-templates'),
    fse = require('fs-extra');

module.exports = function (dir, setting) {

    // var tmpDirectory = dir.build + '/tmp/img';
    var tplTempDirectory = dir.build + '/tmp/tpl';

    gulp.task('asset:html', function () {
        var rootStream = gulp.src(dir.src + '/*.html');
        var stream = gulp.src(dir.src + '/app/templates/**/*.html');
        if (setting.production) {
            rootStream = minifyHtml(rootStream).on('error', setting.error);
            stream = minifyHtml(stream).on('error', setting.error);
        }
        rootStream.pipe(gulp.dest(dir.buildWeb));
        return stream.pipe(gulp.dest(tplTempDirectory));
    });

    gulp.task('asset:etc', ['asset:html'], function () {
        return gulp.src(dir.src + '/*')
            .pipe(gulp.dest(dir.buildWeb));
    });

    gulp.task('asset:template', ['asset:etc'], function () {
        findInFileAndReplace(dir.buildWeb + '/offline.manifest', '__DATE__', getDate());
        if (!setting.production) {
            // removing offline manifest in dev mode
            findInFileAndReplace(dir.buildWeb + '/index.html', 'manifest="offline.manifest"', '');
        }
        var stream = gulp.src(tplTempDirectory + '/**/*.html')
         .pipe(inline('build/app/html/index.html', {
                base: 'build/tmp',
         method: 'append'
            }));
        if (setting.production) {
            stream = minifyHtml(stream).on('error', setting.error);
        }
        return stream.pipe(gulp.dest(dir.buildWeb));
    });

    gulp.task('asset:lib', function () {
        var libs = [
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
        return gulp.src([dir.src + '/fonts/**/*', dir.npm + '/md-font/iconfont/*'])
            .pipe(gulp.dest(dir.buildWeb + '/fonts'));
    });

    gulp.task('asset:image', function () {
        gulp.src(dir.src + '/images/**/*')
            .pipe(gulp.dest(dir.buildWeb + '/img'));
    });

    // gulp.task('asset:image:optimize', function () {
    //     var stream = gulp.src(dir.src + '/images/**/*');
    //     if (setting.production) {
    //         stream = stream.pipe(imageop({
    //             optimizationLevel: 5,
    //             progressive: true,
    //             interlaced: true
    //         })).on('error', setting.error);
    //     }
    //     return stream.pipe(gulp.dest(tmpDirectory));
    // });

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

    function findInFileAndReplace(file, search, replace) {
        try {
            if (!fse.existsSync(file)) return;
            var content = fse.readFileSync(file, {encoding: 'utf8'});
            content = content.replace(search, replace);
            fse.writeFileSync(file, content);
        } catch (e) {
            console.error(e.message);
        }
    }

    function getDate() {
        var d = new Date();
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
};