import {IExtRootScopeService} from "../ClientApp";
import {SidenavService} from "../service/SidenavService";
import {IStateService} from "angular-ui-router";
import {ILocationService} from "angular";
import IState = ng.ui.IState;

export class BaseController {
    private sideNavName = 'main-sidenav';
    public static $inject = ['$rootScope', '$state', 'sidenavService', '$location'];

    constructor(private $rootScope:IExtRootScopeService, private $state:IStateService, private sidenavService:SidenavService, $location:ILocationService) {
        $rootScope.bvm = this;
    }

    public toggleSidenav() {
        this.sidenavService.get(this.sideNavName).toggle();
    }
}