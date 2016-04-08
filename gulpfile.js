var gulp = require('gulp'),
    path = require('path');

var root = __dirname;
var dir = {
    root: root,
    bower: path.join(root, 'bower_components'),
    resource: path.join(root, 'resources'),
    gulp: path.join(root, 'resources/gulp'),
    typescriptLibrary: path.join('resources/tsd'),
    src: path.join(root, 'src'),
    build: path.join(root, 'build')
};

var modules = ['asset', 'sass', 'ts'],
    defaultTasks = [],
    watches = [],
    setting = {
        production: false
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

gulp.task('production', function (done) {
    setting.production = true;
    done();
});

gulp.task('default', defaultTasks.concat(watches));
gulp.task('prod', ['production'].concat(defaultTasks));
