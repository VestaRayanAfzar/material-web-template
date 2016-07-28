import {IStateService} from "angular-ui-router";
import {IQueryResult} from "vesta-schema/ICRUDResult";
import {BaseController} from "./BaseController";
import {IExtRootScopeService} from "../ClientApp";
import {SidenavService} from "../service/SidenavService";
import {AuthService} from "../service/AuthService";
import {AppMenuService} from "../service/AppMenuService";
import {IUser} from "../cmn/models/User";

export class RootController extends BaseController {
    public static $inject = ['$rootScope', '$state', 'sidenavService', 'appMenuService'];

    constructor(private $rootScope:IExtRootScopeService, private $state:IStateService, private sidenavService:SidenavService, private appMenuService:AppMenuService) {
        super();
        $rootScope.rvm = this;
        $rootScope.$on(AuthService.Events.Update, ()=> {
            this.$rootScope.user = this.authService.getUser();
            this.appMenuService.get('main-menu', true).then(menu=> menu.ctrl.update(menu.items));
        });
    }

    public  logout() {
        this.authService.logout();
        this.apiService.get<any, IQueryResult<IUser>>('account/logout')
            .then(result=> {
                this.authService.login(result.items[0]);
                this.$state.go('login');
            });
    }
}