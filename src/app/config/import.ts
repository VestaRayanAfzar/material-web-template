import {SidenavService} from "../service/SidenavService";
import {MetaTagsService} from "../service/MetaTagsService";
import {DatePickerService} from "../service/DatePickerService";
import {NetworkService} from "../service/NetworkService";
import {NotificationService} from "../service/NotificationService";
import {AppCacheService} from "../service/AppCacheService";
import {StorageService} from "../service/StorageService";
import {FormService} from "../service/FormService";
import {DatabaseService} from "../service/DatabaseService";
import {AuthService} from "../service/AuthService";
import {ApiService} from "../service/ApiService";
import {TranslateService} from "../service/TranslateService";
import {I18nService} from "../service/I18nService";
import {AppMenuService} from "../service/AppMenuService";
import {LogService} from "../service/LogService";
import {translateFilter} from "../filter/translateFilter";
import {paginationFilter} from "../filter/paginationFilter";
import {dateTimeFilter} from "../filter/dateTimeFilter";
import {animDirection} from "../directive/animDirection";
import {currencyInput} from "../directive/currencyInput";
import {dateInput} from "../directive/dateInput";
import {fileUpload} from "../directive/fileUpload";
import {roundImage} from "../directive/roundImage";
import {viewportSpy} from "../directive/viewportSpy";
import {metaTags} from "../directive/metaTags";
import {sidenav} from "../directive/sidenav";
import {menuTrigger} from "../directive/menuTrigger";
import {appMenu} from "../directive/appMenu";
import {carousel} from "../directive/carousel";
import {RootController} from "../modules/RootController";
import {HomeController} from "../modules/HomeController";
import {AboutController} from "../modules/AboutController";
import {LoginController} from "../modules/account/LoginController";
///<vesta:import/>

interface IExporter {
    controller:any;
    service:any;
    filter:any;
    directive:any;
}

export const exporter:IExporter = {
    service: {
        i18nService: I18nService,
        translateService: TranslateService,
        apiService: ApiService,
        authService: AuthService,
        databaseService: DatabaseService,
        formService: FormService,
        logService: LogService,
        storageService: StorageService,
        appCacheService: AppCacheService,
        notificationService: NotificationService,
        networkService: NetworkService,
        datePickerService: DatePickerService,
        metaTagsService: MetaTagsService,
        sidenavService: SidenavService,
        appMenuService: AppMenuService,
        ///<vesta:ngService/>
    },
    filter: {
        dateTime: dateTimeFilter,
        pagination: paginationFilter,
        tr: translateFilter,
        ///<vesta:ngFilter/>
    },
    directive: {
        animDirection: animDirection,
        currencyInput: currencyInput,
        dateInput: dateInput,
        fileUpload: fileUpload,
        roundImage: roundImage,
        viewportSpy: viewportSpy,
        metaTags: metaTags,
        sidenav: sidenav,
        menuTrigger: menuTrigger,
        appMenu: appMenu,
        carousel: carousel,
        ///<vesta:ngDirective/>
    },
    controller: {
        rootController: RootController,
        homeController: HomeController,
        aboutController: AboutController,
        loginController: LoginController,
        ///<vesta:ngController/>
    }
};
