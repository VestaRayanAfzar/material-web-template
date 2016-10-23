import {BaseController} from "./BaseController";
import {AuthService} from "../service/AuthService";

export class AboutController extends BaseController {
    public static $inject = [];

    constructor() {
        super();
        this.metaTagsService.setTitle('Vesta :: About');
    }

    public static registerPermissions() {
        AuthService.registerPermissions('about');
    }
}