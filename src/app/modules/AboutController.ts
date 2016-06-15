import {BaseController} from "./BaseController";
import {AuthService} from "../service/AuthService";

export class AboutController extends BaseController {
    public static $inject = [];

    constructor() {
        super();
    }

    public static registerPermissions() {
        AuthService.registerPermissions('about');
    }
}