import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {IExtRootScopeService} from "../ClientApp";
import {SidenavService} from "../service/SidenavService";

export interface ISidenavScope extends IScope {
}

export class SidenavController {
    public static Event = {Open: 'sidenav.open', Close: 'sidenav.close'};
    private static SIDENAV_OPEN_CLASS_NAME = 'sidenav-open';
    private classList:DOMTokenList;
    public componentId:string;
    public closeEvent:string;
    private bodyClassName:string;
    public static $inject = ['$scope', '$element', '$rootScope', 'sidenavService'];

    constructor(private $scope:ISidenavScope, private $element:IAugmentedJQuery, private $rootScope:IExtRootScopeService,
                private sidenavService:SidenavService) {
        this.classList = $element[0].classList;
        this.bodyClassName = `${this.componentId}-open`;
        sidenavService.register(this);
        this.classList.add(this.componentId);
        var remover = $rootScope.$on(this.closeEvent, ()=>this.close());
        $rootScope.$on('$destroy', ()=> remover());
    }

    public toggle():boolean {
        if (this.isOpen()) return this.close();
        return this.open();
    }

    public close() {
        this.$rootScope.$broadcast(SidenavController.Event.Close);
        this.classList.remove(SidenavController.SIDENAV_OPEN_CLASS_NAME);
        document.body.classList.remove(this.bodyClassName);
        return false;
    }

    public open() {
        this.$rootScope.$broadcast(SidenavController.Event.Open);
        this.classList.add(SidenavController.SIDENAV_OPEN_CLASS_NAME);
        document.body.classList.add(this.bodyClassName);
        return true;
    }

    public isOpen():boolean {
        return this.classList.contains(SidenavController.SIDENAV_OPEN_CLASS_NAME);
    }
}

/**
 * @ngdoc directive
 * @name sidenav
 * @restrict E
 *
 * @param {string} component-id
 * @param {string} close-event
 */

export function sidenav():IDirective {
    return {
        restrict: 'E',
        replace: true,
        template: `<div class="sidenav"><div ng-transclude></div></div>`,
        controller: SidenavController,
        controllerAs: 'ctrl',
        transclude: true,
        bindToController: {
            componentId: '=',
            closeEvent: '='
        },
        scope: {},
        link: function (scope:ISidenavScope, $element:IAugmentedJQuery, attrs:IAttributes) {
        }
    }
}
