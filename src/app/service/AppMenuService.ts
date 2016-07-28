import {IQService, IPromise, IDeferred} from "angular";
import {IMenuItem} from "../config/app-menu";
import {AuthService} from "./AuthService";
import {AppMenuController} from "../directive/appMenu";

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
    private static menuItems:{[componentId:string]:Array<IMenuItem>} = {};
    private static menus:IMenuStorage = {};
    private deferredRequests:IDeferredQ = {};
    public static $inject = ['authService', '$q'];

    constructor(private authService:AuthService, private $q:IQService) {

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
        if (!AppMenuService.menus[id]) AppMenuService.menus[id] = <IMenuWithController>{};
        AppMenuService.menuItems[id] = items;
    }

    /**
     * Each menuItem directive will register it's controller here
     *  after registering this method checks if there are any deferred request for this menu and resolve them
     */
    public register(id:string, ctrl:AppMenuController) {
        var menu = AppMenuService.menus[id];
        if (!menu) AppMenuService.menus[id] = <IMenuWithController>{};
        menu.ctrl = ctrl;
        if (this.deferredRequests[id]) {
            let defer = this.deferredRequests[id];
            delete this.deferredRequests[id];
            menu.items = this.extractMenu(AppMenuService.menuItems[id]);
            for (let i = 0, il = defer.length; i < il; ++i) {
                defer[i].resolve(menu);
            }
        }
    }

    /**
     * If a menu has not registered it's controller, the promise will wait until it does, and then
     *  all those deferred wil be resolved
     */
    public get(id:string, forceController = false):IPromise<IMenuWithController> {
        let items = AppMenuService.menuItems[id];
        if (!items) return this.$q.reject(`No menu items has been set for ${id}. Use AppMenuService.setMenuItem`);
        let menu = AppMenuService.menus[id];
        if (!menu.ctrl && forceController) {
            if (!this.deferredRequests[id]) this.deferredRequests[id] = [];
            let defer = this.$q.defer<IMenuWithController>();
            this.deferredRequests[id].push(defer);
            return defer.promise;
        }
        menu.items = this.extractMenu(AppMenuService.menuItems[id]);
        return this.$q.resolve(menu);
    }
}