var path = require('path'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    server = require('gulp-develop-server'),
    root = path.join(__dirname, '../..'),
    buildDirectory = path.join(root, 'build'),
    setting = require('./setting');

gulp.task('default', function () {
    // http server for serving static files
    server.listen({
        path: buildDirectory + '/static-server/staticApp.js',
        execArgv: ['--debug']
    });
    // update src file
    gulp.watch([buildDirectory + '/static-server/**/*'], function () {
        server.restart();
    });
});

gulp.task('browse', function () {
    // launching browser and keep it synced with asset updates
    var port = getHostPort();
    browserSync.init(null, {
        proxy: setting.httpServer + (port ? (':' + port) : ''),
        files: [buildDirectory + '/**/*', '!' + buildDirectory + '/static-server/**/*']
    });
    function getHostPort() {
        var yaml = require('yamljs');
        var compose = yaml.load(path.join(root, 'docker-compose.yml'));
        var service = compose.services['static-server'];
        for (var i = service.ports.length; i--;) {
            var ports = service.ports[i].split(':');
            if (+ports[1] == service.environment.PORT) {
                return +ports[0];
            }
        }
    }
});
