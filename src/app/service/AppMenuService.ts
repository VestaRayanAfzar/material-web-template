import {IMenuItem} from "../config/app-menu";
import {AuthService} from "./AuthService";
import {AppMenuController} from "../directive/appMenu";
import IPromise = angular.IPromise;
import IQService = angular.IQService;
import IDeferred = angular.IDeferred;

export interface IMenuWithController {
    ctrl:AppMenuController;
    items:Array<IMenuItem>;
}

interface IMenuStorage {
    [is:string]:IMenuWithController;
}

interface IDeferredQ {
    [id:string]:Array<IDeferred<IMenuWithController>>;
}

export class AppMenuService {
    private static menuItems:IMenuStorage = {};
    private deferredRequests:IDeferredQ = {};
    public static $inject = ['authService', '$q'];

    constructor(private authService:AuthService, private $q:IQService) {

    }

    /**
     * If a menu has not registered it's controller, the promise will wait until it does, and then
     *  all those deferred wil be resolved
     */
    public getMenu(id:string):IPromise<IMenuWithController> {
        let menu = AppMenuService.menuItems[id];
        if (!menu.items) return this.$q.reject(`No menu items has been set for ${id}`);
        if (!menu.ctrl) {
            // console.log(`enqueing the request for menu: ${id}`);
            if (!this.deferredRequests[id]) this.deferredRequests[id] = [];
            let defer = this.$q.defer<IMenuWithController>();
            this.deferredRequests[id].push(defer);
            return defer.promise;
        }
        return this.$q.resolve(menu);
    }

    private extractMenu(items:Array<IMenuItem>):Array<IMenuItem> {
        var result:Array<IMenuItem> = [];
        for (let i = 0, il = items.length; i < il; ++i) {
            let menuItem = items[i];
            let state = menuItem.state;
            if (!state || this.authService.hasAccessToState(state)) {
                if (menuItem.children && menuItem.children.length) {
                    let childResult = this.extractMenu(menuItem.children);
                    if (childResult.length) {
                        result.push({
                            title: menuItem.title,
                            url: menuItem.url,
                            state: state,
                            children: childResult
                        });
                    }
                } else {
                    result.push(menuItem);
                }
            }
        }
        return result;
    }

    /**
     * each menu of application will register it's items by this method
     */
    public static setMenuItems(id:string, items:Array<IMenuItem>) {
        if (!AppMenuService.menuItems[id]) AppMenuService.menuItems[id] = <IMenuWithController>{};
        AppMenuService.menuItems[id].items = items;
    }

    /**
     * Each menuItem directive will register it's controller here
     *  after registering this method checks if there are any deferred request for this menu and resolve them
     */
    public setController(id:string, ctrl:AppMenuController) {
        if (!AppMenuService.menuItems[id]) AppMenuService.menuItems[id] = <IMenuWithController>{};
        AppMenuService.menuItems[id].ctrl = ctrl;
        if (this.deferredRequests[id]) {
            let defer = this.deferredRequests[id];
            delete this.deferredRequests[id];
            for (let i = 0, il = defer.length; i < il; ++i) {
                defer[i].resolve(AppMenuService.menuItems[id]);
            }
        }
    }
}