import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {IExtRootScopeService} from "../ClientApp";
import {SidenavService} from "../service/SidenavService";

export interface ISidenavScope extends IScope {
}


export class SidenavController {
    private static SIDENAV_OPEN_CLASS_NAME = 'sidenav-open';
    public static SIDENAV_OPEN_EVENT_NAME = 'sidenav.open';
    public static SIDENAV_CLOSE_EVENT_NAME = 'sidenav.close';
    private classList:DOMTokenList;
    public componentId:string;
    public static $inject = ['$scope', '$element', '$rootScope', 'sidenavService'];

    constructor(private $scope:ISidenavScope, private $element:IAugmentedJQuery, private $rootScope:IExtRootScopeService,
                private sidenavService:SidenavService) {
        this.classList = $element[0].classList;
        sidenavService.add(this);
        var remover = this.$rootScope.$on('$stateChangeStart', e=>this.close());
        $scope.$on('$destroy', e=>remover());
    }

    public toggle():boolean {
        if (this.isOpen()) return this.close();
        return this.open();
    }

    public close() {
        this.$rootScope.$broadcast(SidenavController.SIDENAV_CLOSE_EVENT_NAME);
        this.classList.remove(SidenavController.SIDENAV_OPEN_CLASS_NAME);
        return false;
    }

    public open() {
        this.$rootScope.$broadcast(SidenavController.SIDENAV_OPEN_EVENT_NAME);
        this.classList.add(SidenavController.SIDENAV_OPEN_CLASS_NAME);
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
 */

export function sidenav():IDirective {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="sidenav"><ng-transclude></ng-transclude></div>',
        controller: SidenavController,
        controllerAs: 'ctrl',
        transclude: true,
        bindToController: {
            componentId: '='
        },
        scope: {},
        link: function (scope:ISidenavScope, $element:IAugmentedJQuery, attrs:IAttributes) {
        }
    }
}
