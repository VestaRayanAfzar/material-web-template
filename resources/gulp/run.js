var path = require('path'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    server = require('gulp-develop-server'),
    root = path.join(__dirname, '../..'),
    buildDirectory = path.join(root, 'build'),
    setting = require('./setting'),
    serverDirectory = path.join(buildDirectory, 'app/server');

gulp.task('default', function () {
    // http server for serving static files
    server.listen({
        path: serverDirectory + '/app.js',
        execArgv: ['--debug'],
        env: {NODE_ENV: 'development', PORT: getHostPort()}
    });
    // update src file
    gulp.watch([serverDirectory + '/**/*'], function () {
        server.restart();
    });
});

gulp.task('browse', function () {
    // launching browser and keep it synced with asset updates
    var port = getHostPort();
    browserSync.init(null, {
        proxy: setting.httpServer + (port ? (':' + port) : ''),
        files: [buildDirectory + '/**/*', '!' + serverDirectory + '/**/*']
    });
});

function getHostPort() {
        var yaml = require('yamljs');
        var compose = yaml.load(path.join(root, 'docker-compose.yml'));
    var service = compose.services['web'];
        for (var i = service.ports.length; i--;) {
            var ports = service.ports[i].split(':');
            if (+ports[1] == service.environment.PORT) {
                return +ports[0];
            }
        }
}