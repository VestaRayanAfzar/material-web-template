import {SidenavController} from "../directive/sidenav";

export class SidenavService {
    private controllers:{[id:string]:SidenavController} = {};
    public static $inject = [];

    constructor() {

    }

    public add(ctrl:SidenavController) {
        this.controllers[ctrl.componentId] = ctrl;
    }

    public get(componentId:string):SidenavController {
        return this.controllers[componentId];
    }
}