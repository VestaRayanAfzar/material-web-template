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
        this.appMenuService.setController(this.componentId, this);
        appMenuService.getMenu(this.componentId).then(menu=> this.menuItems = menu.items);
    }

    public update() {
        let html = '';
        for (let i = 0, il = this.menuItems.length; i < il; ++i) {
            html += this.generateHtml(this.menuItems[i], 0);
        }
        let menuListElement = this.$element[0].querySelector('ul');
        if (menuListElement) {
            menuListElement.innerHTML = html;
        }
    }

    private generateHtml(menuItem:IMenuItem, level:number):string {
        var hasChild = menuItem.children && menuItem.children.length;
        let html = `<li class="menu-item item-l${level}${hasChild ? ' has-child' : ''}"><a href="${menuItem.url}">${menuItem.title}</a>`;
        if (!hasChild) return html + '</li>';
        html += `<ul class="menu-list list-l${level + 1}">`;
        for (let i = 0, il = menuItem.children.length; i < il; ++i) {
            html += this.generateHtml(menuItem.children[i], level + 1);
        }
        html += '</ul></li>';
        return html;
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
