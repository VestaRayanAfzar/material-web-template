import {AuthService, IAclActions} from "../../service/AuthService";
import {BaseController} from "../BaseController";


export class SignupController extends BaseController {
    public acl:IAclActions;
    public static $inject = [];

    constructor() {
        super();
    }

    public static registerPermissions() {
        AuthService.registerPermissions('signup', {account: ['register']});
    }
}