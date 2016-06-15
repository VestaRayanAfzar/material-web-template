import {SidenavService} from "../../service/SidenavService";
import {AuthService} from "../../service/AuthService";
import {BaseController} from "../BaseController";
import {IMenuItem} from "../../directive/sidenav";

export class AclController extends BaseController {
    public static $inject = [];
    public menuItems:Array<IMenuItem> = [
        {state: 'acl.role', title: 'نقش'},
        {state: 'acl.roleGroup', title: 'گروه نقش'},
        {state: 'acl.user', title: 'کاربر'},
    ];

    constructor(private sidenavService:SidenavService) {
        super();
    }

    static registerPermissions() {
        AuthService.registerPermissions('acl', {'acl.role': ['read'], 'acl.user': ['read'], 'acl.roleGroup': ['read']});
    }
}