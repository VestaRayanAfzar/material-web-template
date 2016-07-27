import {setting} from "./config/setting";
import {router} from "./config/route";
import {ClientApp} from "./ClientApp";
import {exporter} from "./config/import";
import {IBaseController} from "./modules/BaseController";

!function onDeviceReady() {
    var isAppLoaded = onScriptsReady();
    if (!isAppLoaded) {
        setTimeout(onDeviceReady, 100);
    }
}();

function onScriptsReady() {
    if (!window['angular']) return false;
    var clientApp = new ClientApp(setting, router);

    var sections = ['controller', 'service', 'filter', 'directive', 'component'];
    for (var i = sections.length; i--;) {
        var method = sections[i];
        for (var module in exporter[method]) {
            if (exporter[method].hasOwnProperty(module)) {
                clientApp.module[method](module, exporter[method][module]);
                if (method == 'controller') {
                    var registerPermissions = (<IBaseController>exporter[method][module]).registerPermissions;
                    registerPermissions && registerPermissions();
                }
            }
        }
    }

    clientApp.bootstrap();
    return true;
}