import {setting} from "./config/setting";
import {router} from "./config/route";
import {ClientApp} from "./ClientApp";
import {exporter} from "./config/import";
import {IBaseController} from "./modules/BaseController";

document.addEventListener('DOMContentLoaded', onDeviceReady, false);

function onDeviceReady() {
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
}