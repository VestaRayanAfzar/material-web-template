import {IExtRootScopeService} from "../ClientApp";
import {SidenavService} from "../service/SidenavService";
import {IStateService} from "angular-ui-router";
import {AuthService} from "../service/AuthService";
import {BaseController} from "./BaseController";

export class RootController extends BaseController {
    private sideNavName = 'main-sidenav';
    public static $inject = ['$rootScope', '$state', 'sidenavService', 'authService'];

    constructor(private $rootScope:IExtRootScopeService, private $state:IStateService, private sidenavService:SidenavService,
                private authService:AuthService) {
        super();
        $rootScope.rvm = this;
    }

    public toggleSidenav() {
        this.sidenavService.get(this.sideNavName).toggle();
    }
}