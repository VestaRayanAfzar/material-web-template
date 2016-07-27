import {SidenavController} from "../directive/sidenav";
import {IMenuItem} from "../config/app-menu";

export class SidenavService {
    private controllers:{[id:string]:SidenavController} = {};
    private menuItemQ:{[name:string]:Array<IMenuItem>} = {};
    public static $inject = [];

    constructor() {

    }

    public add(ctrl:SidenavController) {
        this.controllers[ctrl.componentId] = ctrl;
        if (this.menuItemQ[ctrl.componentId]) {
            this.setMenu(ctrl.componentId, this.menuItemQ[ctrl.componentId]);
            delete this.menuItemQ[ctrl.componentId];
        }
    }

    public get(componentId:string):SidenavController {
        return this.controllers[componentId];
    }

    public setMenu(componentId:string, menuItems:Array<IMenuItem>) {
        if (this.controllers[componentId]) {
            this.controllers[componentId].setMenu(menuItems);
        } else {
            this.menuItemQ[componentId] = menuItems;
        }
    }
}