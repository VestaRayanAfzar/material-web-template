import {IRoleGroup, RoleGroup} from "../../../cmn/models/RoleGroup";
import {Err} from "vesta-util/Err";
import {AuthService} from "../../../service/AuthService";
import {BaseController} from "../../BaseController";
import {IUpsertResult} from "vesta-schema/ICRUDResult";
import {IFormController} from "angular";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {IRole} from "../../../cmn/models/Role";
import IDialogService = angular.material.IDialogService;


export class RoleGroupAddController extends BaseController {
    private roleGroup:RoleGroup;
    private roleGroupForm:IFormController;
    public roles:Array<IRole> = [];
    public selectedRoles:any = {};
    public static $inject = ['apiService', 'formService', 'notificationService', '$mdDialog', 'locals'];

    constructor(private apiService:ApiService, private formService:FormService, private notificationService:NotificationService, private $mdDialog:IDialogService, private locals:any) {
        super();
        this.roleGroup = new RoleGroup();
        this.roles = locals.roles;
    }

    public closeFormModal() {
        this.$mdDialog.cancel();
    }

    public addRoleGroup() {
        var validate = this.formService.evaluate(this.roleGroup.validate(), this.roleGroupForm);
        if (!validate) return;
        var roleGroup = this.roleGroup.getValues<IRoleGroup>();
        roleGroup.roles = [];
        for (var id in this.selectedRoles) {
            if (this.selectedRoles.hasOwnProperty(id) && this.selectedRoles[id]) {
                roleGroup.roles.push(id);
            }
        }
        this.apiService.post<IRoleGroup, IUpsertResult<IRoleGroup>>('roleGroup', roleGroup)
            .then(result=> {
                if (result.error) {
                    if (result.error.code == Err.Code.Validation) {
                        this.formService.evaluate(result.error['violations'], this.roleGroupForm);
                    }
                    return this.notificationService.toast(result.error.message);
                }
                this.$mdDialog.hide(result.items[0]);
            })
            .catch(reason=> {
                this.$mdDialog.cancel(reason);
            });
    }

    public static registerPermissions() {
        AuthService.registerPermissions('acl.roleGroup', {'acl.roleGroup': ['read']});
    }
}