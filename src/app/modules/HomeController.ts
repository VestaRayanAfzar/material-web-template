import {BaseController} from "./BaseController";
import {AuthService} from "../service/AuthService";

export class HomeController extends BaseController {
    public date:number;
    public static $inject = [];

    constructor() {
        super();
        this.date = Date.now();
    }

    public static registerPermissions() {
        AuthService.registerPermissions('home');
    }
}
