import {IExtRootScopeService} from "../ClientApp";
import {IScope} from 'angular';
import IState = ng.ui.IState;
import IStateService = ng.ui.IStateService;

interface IStateHistory {
    name: string;
    params: any;
}

export class BaseController {
    private states:Array<IStateHistory> = [];
    public pageTitle:string;
    public showBackButton:boolean = true;
    public static $inject = ['$rootScope', '$state'];

    constructor(private $rootScope:IExtRootScopeService, private $state:IStateService) {
        $rootScope.bvm = this;
        $rootScope.$on('$stateChangeSuccess', (event, toState:IState, toStateParams, fromState:IState, fromStateParams)=> {
            if (fromState.name) {
                this.states.push({name: fromState.name, params: fromStateParams});
            }
            this.showBackButton = toState.name != 'home';
        });
    }

    public goBack() {
        var state2go = this.states.pop();
        if (state2go) {
            this.$state.go(state2go.name, state2go.params);
        } else if (this.$state.current.name != 'home') {
            this.$state.go('home');
        }
    }
}