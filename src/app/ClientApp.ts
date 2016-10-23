import {
    IRootScopeService,
    IModule,
    IAngularEvent,
    IAngularBootstrapConfig,
    ILocationProvider,
    IHttpProvider,
    ICompileProvider
} from "angular";
import {IState, IStateService, IStateProvider, IUrlRouterProvider} from "angular-ui-router";
import {IClientAppSetting} from "./config/setting";
import {IRouteFunction} from "./config/route";
import {AuthService, AclPolicy} from "./service/AuthService";
import {NetworkService} from "./service/NetworkService";
import {I18nService} from "./service/I18nService";
import {IViewport} from "./directive/viewportSpy";
import {AppCacheService} from "./service/AppCacheService";
import {ILocale} from "vesta-i18n/ILocale";
import {IUser, User} from "./cmn/models/User";
import {IQueryResult, IQueryRequest} from "vesta-schema/ICRUDResult";
import {ApiService} from "./service/ApiService";
import {RootController} from "./modules/RootController";
import {AppMenuService} from "./service/AppMenuService";
import {AppMenu} from "./config/app-menu";
import {Err} from "vesta-util/Err";

export interface IExtRootScopeService extends IRootScopeService {
    rvm: RootController;
    vp: IViewport,
    locale: ILocale;
    pageTitle: string;
    isDeviceOrSmall: boolean;
    user: IUser;
}

export class ClientApp {
    public static Setting: IClientAppSetting;
    public module: IModule;

    constructor(private setting: IClientAppSetting, router: IRouteFunction) {
        ClientApp.Setting = setting;
        this.init(router);
    }

    /**
     * This method is equivalent to angular.module.config & angular.module.run
     */
    private init(router: IRouteFunction) {
        this.module = angular.module(this.setting.name, ['ngMessages', 'ui.router', 'ngMaterial', 'md.data.table']);
        this.module.constant('Setting', this.setting);
        // CONFIG
        AppMenuService.setMenuItems('main-menu', AppMenu);
        AuthService.setDefaultPolicy(AclPolicy.Deny);
        this.module.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$compileProvider',
            function ($stateProvider: IStateProvider, $locationProvider: ILocationProvider, $urlRouterProvider: IUrlRouterProvider, $httpProvider: IHttpProvider, $compileProvider: ICompileProvider) {
                $compileProvider.debugInfoEnabled(ClientApp.Setting.env != 'production');
                $httpProvider.useApplyAsync(true);
                router($stateProvider, $locationProvider, $urlRouterProvider);
            }]);
        /**
         * Initiating common services; These services are likely to be injected everywhere
         * After this, these services can be used by their `getInstance` method. e.g AuthService.getInstance()
         * This action will cause the DI on class names to be much shorter => increasing the readability
         */
        this.module.run(['apiService', 'authService', 'logService', 'formService', 'notificationService', 'metaTagsService', (apiService, authService, logService, formService, notificationService, metaTagsService)=> {
        }]);
        // RUN
        this.module.run(['$rootScope', '$state', 'networkService', 'i18nService', 'appCacheService',
            ($rootScope: IExtRootScopeService, $state: IStateService, networkService: NetworkService, i18nService: I18nService, appCacheService: AppCacheService)=> {
                $rootScope.locale = i18nService.get();
                this.aclCheck($rootScope, $state);
                this.connectionWatcher(networkService);
                appCacheService.update();
                this.checkAuthStatus($state);
            }]);
    }

    /**
     1) Some time user data is removed from localStorage however the token is valid.
     So from client side point of view user is NOT authenticated. However the token might valid on serverSide.

     2) Some time user data exists in localStorage however the server session database is cleared.
     So from client side point of view user is authenticated. However the token does not exist on serverSide.

     The /me (GET) edge is responsible to returns the authenticated user data in case the token is valid.
     In case there is no token or user is not authenticated the guest user will be returned.
     */
    private checkAuthStatus($state: IStateService) {
        let authService = AuthService.getInstance();
        ApiService.getInstance().get<IQueryRequest<IUser>, IQueryResult<IUser>>('me')
            .then(result=> {
                if (result.error || !result.items || !result.items.length) throw result.error;
                var me = new User(result.items[0]);
                authService.login(me);
            })
            .catch(err=> {
                console.error('ClientApp.checkAuthStatus', err);
                if (err.code !== Err.Code.NoDataConnection) {
                    authService.logout();
                    $state.go('login');
                }
            })
    }

    private aclCheck($rootScope: IExtRootScopeService, $state: IStateService) {
        let authService = AuthService.getInstance();
        $rootScope.$on('$stateChangeStart', (event: IAngularEvent, toState: IState)=> {
            if (!authService.hasAccessToState(toState.name)) {
                event.preventDefault();
                console.log(`Prevent from going to forbidden state "${toState.name}"`);
                return false;
            }
        });
    }

    private connectionWatcher(networkService: NetworkService) {
        window.addEventListener('online', ()=> changeStatus(true), false);
        window.addEventListener('offline', ()=> changeStatus(false), false);
        changeStatus(networkService.isOnline());
        function changeStatus(isOnline: boolean) {
            document.body.classList[isOnline ? 'remove' : 'add']('net-offline');
        }
    }

    public bootstrap() {
        var isProduction = this.setting.env == 'production';
        var bsConfig: IAngularBootstrapConfig = {
            strictDi: isProduction
        };
        angular.bootstrap(document, [this.setting.name], bsConfig);
    }
}