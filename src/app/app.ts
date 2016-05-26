import {setting} from "./config/setting";
import {router} from "./config/route";
import {ClientApp} from "./ClientApp";
import * as imp from "./config/import";

document.addEventListener('DOMContentLoaded', onDeviceReady, false);

function onDeviceReady() {
    var clientApp = new ClientApp(setting, router);

    clientApp.module.service('i18nService', imp.I18nService);
    clientApp.module.service('translateService', imp.TranslateService);
    clientApp.module.service('apiService', imp.ApiService);
    clientApp.module.service('authService', imp.AuthService);
    clientApp.module.service('storageService', imp.StorageService);
    clientApp.module.service('formService', imp.FormService);
    clientApp.module.service('databaseService', imp.DatabaseService);
    clientApp.module.service('notificationService', imp.NotificationService);
    clientApp.module.service('networkService', imp.NetworkService);
    clientApp.module.service('datePickerService', imp.DatePickerService);
    clientApp.module.service('sidenavService', imp.SidenavService);
    clientApp.module.service('metaTagsService', imp.MetaTagsService);
    clientApp.module.service('appCacheService', imp.AppCacheService);
    ///<vesta:ngService/>
    clientApp.module.filter('dateTime', imp.dateTimeFilter);
    clientApp.module.filter('pagination', imp.paginationFilter);
    clientApp.module.filter('tr', imp.translateFilter);
    ///<vesta:ngFilter/>
    clientApp.module.controller('baseController', imp.BaseController);
    clientApp.module.controller('homeController', imp.HomeController);
    clientApp.module.controller('aboutController', imp.AboutController);
    ///<vesta:ngController/>
    clientApp.module.directive('animDirection', imp.animDirection);
    clientApp.module.directive('currencyInput', imp.currencyInput);
    clientApp.module.directive('dateInput', imp.dateInput);
    clientApp.module.directive('fileUpload', imp.fileUpload);
    clientApp.module.directive('roundImage', imp.roundImage);
    clientApp.module.directive('viewportSpy', imp.viewportSpy);
    clientApp.module.directive('menuTrigger', imp.menuTrigger);
    clientApp.module.directive('sidenav', imp.sidenav);
    clientApp.module.directive('metaTags', imp.metaTags);
    ///<vesta:ngDirective/>

    clientApp.bootstrap();
}