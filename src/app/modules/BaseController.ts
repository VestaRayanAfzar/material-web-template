import {IExtRootScopeService} from "../ClientApp";
import IState = ng.ui.IState;
import IStateService = ng.ui.IStateService;

export class BaseController {
    public pageTitle:string;
    public static $inject = ['$rootScope', '$state'];

    constructor(private $rootScope:IExtRootScopeService, private $state:IStateService) {
        $rootScope.bvm = this;
    }
}