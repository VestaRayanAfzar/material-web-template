import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {IExtRootScopeService} from "../ClientApp";
import {SidenavController} from "./sidenav";

export interface IMenuTriggerScope extends IScope {
}


/**
 * @ngdoc directive
 * @name menuTrigger
 * @restrict E
 *
 */

export function menuTrigger():IDirective {
    return {
        restrict: 'E',
        replace: true,
        template: `<div class="menu-trigger"><span></span><span></span><span></span></div>`,
        scope: {},
        link: function (scope:IMenuTriggerScope, $element:IAugmentedJQuery, attrs:IAttributes) {
            var classList = $element[0].classList;
            $element[0].addEventListener('click', toggler, false);
            var sidenavEventRemover = scope.$root.$on(SidenavController.SIDENAV_CLOSE_EVENT_NAME, ()=> {
                classList.remove('opened');
            });

            scope.$on('$destroy', ()=> {
                sidenavEventRemover();
                $element[0].removeEventListener('click', toggler);
            });

            function toggler() {
                classList.toggle('opened');
                (<IExtRootScopeService>scope.$root).rvm.toggleSidenav();
            }
        }
    }
}
