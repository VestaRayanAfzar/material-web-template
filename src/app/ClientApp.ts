import {IRootScopeService, IModule, IAngularEvent, IAngularBootstrapConfig, ILocationProvider} from "angular";
import {IState, IStateService, IStateProvider, IUrlRouterProvider} from "angular-ui-router";
import {IClientAppSetting} from "./config/setting";
import {IRouteFunction} from "./config/route";
import {AuthService} from "./service/AuthService";
import {StorageService} from "./service/StorageService";
import {NetworkService} from "./service/NetworkService";
import {I18nService} from "./service/I18nService";
import {IViewport} from "./directive/viewportSpy";
import {AppCacheService} from "./service/AppCacheService";
import {ILocale} from "vesta-i18n/ILocale";
import {IUser} from "./cmn/models/User";
import {IQueryResult, IQueryRequest} from "vesta-schema/ICRUDResult";
import {ApiService} from "./service/ApiService";
import {Err} from "vesta-util/Err";
import {RootController} from "./modules/RootController";

export interface IExtRootScopeService extends IRootScopeService {
    rvm:RootController;
    vp:IViewport,
    locale:ILocale;
    pageTitle:string;
    isDeviceOrSmall:boolean;
}

export class ClientApp {
    public module:IModule;

    constructor(private setting:IClientAppSetting, router:IRouteFunction) {
        this.init(router);
    }

    private init(router:IRouteFunction) {
        this.module = angular.module(this.setting.name, ['ngMessages', 'ui.router', 'ngMaterial', 'md.data.table']);
        this.module.constant('Setting', this.setting);
        // CONFIG
        this.module.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
            function ($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider) {
                router($stateProvider, $locationProvider, $urlRouterProvider);
            }]);
        // RUN
        this.module.run(['$rootScope', 'authService', '$state', 'storageService', 'networkService', 'i18nService', 'appCacheService', 'apiService',
            ($rootScope:IExtRootScopeService, authService:AuthService, $state:IStateService, storageService:StorageService, networkService:NetworkService, i18nService:I18nService, appCacheService:AppCacheService, apiService:ApiService)=> {
                $rootScope.locale = i18nService.get();
                this.aclCheck($rootScope, authService, $state);
                this.connectionWatcher(networkService);
                appCacheService.update();
                this.checkAuthStatus(authService, apiService, $state);
            }])
    }

    /**
     1) Some time user data is removed from localStorage however the token is valid.
     So from client side point of view user is NOT authenticated. However the token might valid on serverSide.

     2) Some time user data exists in localStorage however the server session database is cleared.
     So from client side point of view user is authenticated. However the token does not exist on serverSide.

     The /account (GET) edge is responsible to returns the authenticated user data in case the token is valid
     */
    private checkAuthStatus(authService:AuthService, apiService:ApiService, $state:IStateService) {
        var isLoggedIn = authService.isLoggedIn();
        apiService.get<IQueryRequest<IUser>, IQueryResult<IUser>>('account')
            .then(result=> {
                var hasData = result.items && result.items.length;
                // 1)
                if (!isLoggedIn && hasData) {
                    authService.login(result.items[0]);
                }
                // 2)
                if (isLoggedIn && !hasData) {
                    authService.logout();
                    $state.go('login');
                }
            })
            .catch(err=> {
                // 2)
                if (/*isLoggedIn && */[Err.Code.Unauthorized, Err.Code.Forbidden].indexOf(err.code) >= 0) {
                    authService.logout();
                    $state.go('login');
                }
            })
    }

    private aclCheck($rootScope:IExtRootScopeService, authService:AuthService, $state:IStateService) {
        $rootScope.$on('$stateChangeStart', (event:IAngularEvent, toState:IState)=> {
            if (!authService.hasAccessToState(toState.name)) {
                event.preventDefault();
                console.log(`Prevent from going to forbidden state "${toState.name}"`);
                return false;
            }
        });
    }

    private connectionWatcher(networkService:NetworkService) {
        window.addEventListener('online', ()=> changeStatus(true), false);
        window.addEventListener('offline', ()=> changeStatus(false), false);
        changeStatus(networkService.isOnline());
        function changeStatus(isOnline:boolean) {
            document.body.classList[isOnline ? 'remove' : 'add']('net-offline');
        }
    }

    public bootstrap() {
        var isProduction = this.setting.env == 'production';
        var bsConfig:IAngularBootstrapConfig = {
            strictDi: !isProduction,
            debugInfoEnabled: !isProduction
        };
        angular.bootstrap(document, [this.setting.name], bsConfig);
    }
}