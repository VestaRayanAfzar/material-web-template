import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {SidenavController} from "./sidenav";
import {SidenavService} from "../service/SidenavService";

export interface IMenuTriggerScope extends IScope {
    componentId:string;
}

export class MenuTriggerController {
    public static $inject = ['$scope', '$element', 'sidenavService'];
    private componentId:string;
    private sidenav:SidenavController;

    constructor($scope:IMenuTriggerScope, $element:IAugmentedJQuery, private sidenavService:SidenavService) {
        let classList = $element[0].classList;
        sidenavService.get(this.componentId)
            .then(ctrl=> this.sidenav = ctrl);
        $element[0].addEventListener('click', this.toggler.bind(this), false);
        let openRemover = $scope.$root.$on(SidenavController.Event.Open, ()=> classList.add('opened'));
        let closeRemover = $scope.$root.$on(SidenavController.Event.Close, ()=> classList.remove('opened'));

        $scope.$on('$destroy', ()=> {
            closeRemover();
            openRemover();
            $element[0].removeEventListener('click', this.toggler);
        });
    }

    private toggler() {
        if (!this.sidenav) {
            console.log(`No sidenav with ${this.componentId} has registered yet!`);
            return;
        }
        this.sidenav.toggle();
    }

}

/**
 * @ngdoc directive
 * @name menuTrigger
 * @restrict E
 *
 * @param {string} component-id
 */

export function menuTrigger():IDirective {
    return {
        restrict: 'E',
        replace: true,
        template: `<div class="menu-trigger"><span></span><span></span><span></span></div>`,
        controller: MenuTriggerController,
        controllerAs: 'ctrl',
        bindToController: {
            componentId: '='
        },
        scope: {},
        link: function (scope:IMenuTriggerScope, $element:IAugmentedJQuery, attrs:IAttributes) {
        }
    }
}
