import {IScope, IDirective, IAugmentedJQuery} from "angular";
import {IMenuItem} from "../config/app-menu";
import {AppMenuService} from "../service/AppMenuService";

export interface IMainMenuScope extends IScope {
}


export class AppMenuController {
    private componentId:string;
    public menuItems:Array<IMenuItem> = [];
    public static $inject = ['$scope', '$element', 'appMenuService'];

    constructor(private $scope:IMainMenuScope, private $element:IAugmentedJQuery, private appMenuService:AppMenuService) {
        $element.addClass(this.componentId);
        this.appMenuService.register(this.componentId, this);
        appMenuService.get(this.componentId).then(menu=> this.menuItems = menu.items);
    }

    public update(menuItems:Array<IMenuItem>) {
        this.menuItems = menuItems;
    }
}

/**
 * @ngdoc directive
 * @name appMenu
 * @restrict E
 *
 * @param {string} component-id
 */

export function appMenu():IDirective {
    return {
        restrict: 'E',
        replace: true,
        template: `<nav role="navigation" class="app-menu">
            <ul role="menu" class="menu-list">
                <li class="menu-item" ng-repeat="item in ctrl.menuItems track by $index">
                    <a ui-sref="{{item.state}}">{{item.title}}</a>
                </li>
            </ul>
        </nav>`,
        controller: AppMenuController,
        controllerAs: 'ctrl',
        bindToController: {
            componentId: '='
        },
        scope: {}
    }
}
