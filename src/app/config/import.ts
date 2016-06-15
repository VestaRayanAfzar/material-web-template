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
import {RootController} from "../modules/RootController";
import {RoleAddController} from "../modules/acl/role/RoleAddController";
import {RoleController} from "../modules/acl/role/RoleController";
import {RoleEditController} from "../modules/acl/role/RoleEditController";
import {RoleGroupController} from "../modules/acl/roleGroup/RoleGroupController";
import {RoleGroupAddController} from "../modules/acl/roleGroup/RoleGroupAddController";
import {RoleGroupEditController} from "../modules/acl/roleGroup/RoleGroupEditController";
import {UserController} from "../modules/acl/user/UserController";
import {UserAddController} from "../modules/acl/user/UserAddController";
import {UserEditController} from "../modules/acl/user/UserEditController";
import {HomeController} from "../modules/HomeController";
import {AboutController} from "../modules/AboutController";
///<vesta:import/>

interface IExporter {
    service:any;
    filter:any;
    directive:any;
    controller:any;
    component:any;
}

export const exporter:IExporter = {
    service: {
        i18nService: I18nService,
        translateService: TranslateService,
        apiService: ApiService,
        authService: AuthService,
        databaseService: DatabaseService,
        formService: FormService,
        storageService: StorageService,
        appCacheService: AppCacheService,
        notificationService: NotificationService,
        networkService: NetworkService,
        datePickerService: DatePickerService,
        metaTagsService: MetaTagsService,
        sidenavService: SidenavService,
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
        ///<vesta:ngDirective/>
    },
    controller: {
        roleController: RoleController,
        roleAddController: RoleAddController,
        roleEditController: RoleEditController,
        roleGroupController: RoleGroupController,
        roleGroupAddController: RoleGroupAddController,
        roleGroupEditController: RoleGroupEditController,
        userController: UserController,
        userAddController: UserAddController,
        userEditController: UserEditController,
        rootController: RootController,
        homeController: HomeController,
        aboutController: AboutController,
        ///<vesta:ngController/>
    },
    component: {
        ///<vesta:ngController/>
    }
};
