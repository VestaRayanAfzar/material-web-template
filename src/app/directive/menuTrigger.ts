import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {IExtRootScopeService} from "../ClientApp";
import {SidenavController} from "./sidenav";

export interface IMenuTriggerScope extends IScope {
    componentId:string;
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
        scope: {
            componentId: '='
        },
        link: function (scope:IMenuTriggerScope, $element:IAugmentedJQuery, attrs:IAttributes) {
            var classList = $element[0].classList;
            $element[0].addEventListener('click', toggler, false);
            var openRemover = scope.$root.$on(SidenavController.Event.Open, ()=> classList.add('opened'));
            var closeRemover = scope.$root.$on(SidenavController.Event.Close, ()=> classList.remove('opened'));

            scope.$on('$destroy', ()=> {
                closeRemover();
                openRemover();
                $element[0].removeEventListener('click', toggler);
            });

            function toggler() {
                // classList.toggle('opened');
                (<IExtRootScopeService>scope.$root).rvm.toggleSidenav(scope.componentId);
            }
        }
    }
}
