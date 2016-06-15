export interface IBaseController {
    registerPermissions:()=>void;
}

export abstract class BaseController {

    public static registerPermissions() {
    }
}