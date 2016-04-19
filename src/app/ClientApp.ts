import {IRootScopeService, IModule, IAngularEvent, IAngularBootstrapConfig, ILocationProvider} from "angular";
import {IState, IStateService, IStateProvider, IUrlRouterProvider} from "angular-ui-router";
import {IClientAppSetting} from "./config/setting";
import {IRouteFunction} from "./config/route";
import {AuthService} from "./service/AuthService";
import {StorageService} from "./service/StorageService";
import {NetworkService} from "./service/NetworkService";
import {I18nService} from "./service/I18nService";
import {ILocale} from "./cmn/I18N";
import {BaseController} from "./modules/BaseController";

export interface IExtRootScopeService extends IRootScopeService {
    bvm:BaseController;
    locale:ILocale;
    pageTitle:string;
}

interface IAppStatus {
    type:string;
    state:string;
    date:number;
}

export class ClientApp {
    private appStatusKey = 'appStatus';
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
        this.module.run(['$rootScope', 'authService', '$state', 'storageService', 'networkService', 'i18nService',
            ($rootScope:IExtRootScopeService, authService:AuthService, $state:IStateService, storageService:StorageService, networkService:NetworkService, i18nService:I18nService)=> {
                $rootScope.locale = i18nService.get();
                $rootScope.pageTitle = 'Vesta Framework';
                this.aclCheck($rootScope, authService, $state);
                this.connectionWatcher(networkService);
                var state2go = this.appWatcher(storageService, $state);
                $state.go(state2go);
            }])
    }

    private aclCheck($rootScope:IExtRootScopeService, authService:AuthService, $state:IStateService) {
        var userForbiddenStates = [];
        var guestForbiddenStates = [];
        $rootScope.$on('$stateChangeStart', (event:IAngularEvent, toState:IState)=> {
            if (authService.isLoggedIn()) {
                if (userForbiddenStates.indexOf(toState.name) >= 0) {
                    event.preventDefault();
                    //$state.go(guestForbiddenStates[0]);
                    return false;
                }
            } else {
                if (guestForbiddenStates.indexOf(toState.name) >= 0) {
                    event.preventDefault();
                    //$state.go(userForbiddenStates[0]);
                    return false;
                }
            }
        });
    }

    private appWatcher(storageService:StorageService, $state:IStateService) {
        var appStatus:IAppStatus = storageService.get<IAppStatus>(this.appStatusKey),
        // todo: state params
        // todo: you may change this to go the last state
            state2go = 'home';
        window.addEventListener('unload', ()=> {
            storageService.set<IAppStatus>(this.appStatusKey, {
                type: 'exit',
                date: Date.now(),
                state: $state.current.name
            });
        }, false);
        return state2go;
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
            strictDi: isProduction,
            debugInfoEnabled: isProduction
        };
        angular.bootstrap(document, [this.setting.name], bsConfig);
    }
}