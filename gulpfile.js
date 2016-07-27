var gulp = require('gulp'),
    path = require('path'),
    fse = require('fs-extra');

var root = __dirname;
var dir = {
    root: root,
    npm: path.join(root, 'node_modules'),
    resource: path.join(root, 'resources'),
    server: path.join(root, 'resources/server'),
    docker: path.join(root, 'resources/docker'),
    gulp: path.join(root, 'resources/gulp'),
    typescriptLibrary: path.join('resources/tsd'),
    src: path.join(root, 'src'),
    build: path.join(root, 'build'),
    buildWeb: path.join(root, 'build/app/html'),
    buildServer: path.join(root, 'build/app/server')
};

var modules = ['asset', 'sass', 'ts', 'server'],
    defaultTasks = [],
    watches = [],
    setting = {
        production: false,
        error: function (err) {
            console.log(err.message, err);
        }
    };

for (var i = 0, il = modules.length; i < il; ++i) {
    var result = require(path.join(dir.gulp, modules[i]))(dir, setting);
    if (result.tasks) {
        defaultTasks = defaultTasks.concat(result.tasks);
    }
    if (result.watch) {
        watches = watches.concat(result.watch);
    }
}

gulp.task('init', function () {
    try {
        fse.removeSync(dir.build);
    } catch (e) {
        console.error(e.message);
    }
});

gulp.task('production', function () {
    setting.production = true;
});

gulp.task('default', ['init'].concat(defaultTasks.concat(watches)));
gulp.task('deploy', ['production', 'init'].concat(defaultTasks));
