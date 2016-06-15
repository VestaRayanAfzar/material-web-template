import {IRoleGroup, RoleGroup} from "../../../cmn/models/RoleGroup";
import {Err} from "vesta-util/Err";
import {AuthService} from "../../../service/AuthService";
import {BaseController} from "../../BaseController";
import {IQueryRequest, IQueryResult, IUpsertResult} from "vesta-schema/ICRUDResult";
import {IFormController} from "angular";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {IRole} from "../../../cmn/models/Role";
import IDialogService = angular.material.IDialogService;


export class RoleGroupEditController extends BaseController {
    private roleGroup:RoleGroup;
    private roleGroupForm:IFormController;
    public roles:Array<IRole> = [];
    public selectedRoles:any = {};
    public static $inject = ['apiService', 'formService', 'notificationService', '$mdDialog', 'locals'];

    constructor(private apiService:ApiService, private formService:FormService, private notificationService:NotificationService, private $mdDialog:IDialogService, private locals:any) {
        super();
        this.roles = locals.roles;
        apiService.get<IQueryRequest<IRoleGroup>, IQueryResult<IRoleGroup>>('roleGroup/' + this.locals.id)
            .then(result=> {
                if (result.error) return $mdDialog.cancel(result.error);
                this.roleGroup = new RoleGroup(result.items[0]);
                this.roleGroup.status = !!this.roleGroup.status;
                for (var i = this.roleGroup.roles.length; i--;) {
                    var role:IRole = this.roleGroup.roles[i];
                    this.selectedRoles[role.id] = true;
                }
            })
            .catch(reason=>$mdDialog.cancel(reason));

    }

    public closeFormModal() {
        this.$mdDialog.cancel();
    }

    public editRoleGroup() {
        if (this.roleGroupForm.$dirty == false) {
            this.$mdDialog.cancel();
            return;
        }
        var validate = this.formService.evaluate(this.roleGroup.validate(), this.roleGroupForm);
        if (!validate) return;
        var roleGroup = this.roleGroup.getValues<IRoleGroup>();
        roleGroup.roles = [];
        for (var id in this.selectedRoles) {
            if (this.selectedRoles.hasOwnProperty(id) && this.selectedRoles[id]) {
                roleGroup.roles.push(id);
            }
        }
        this.apiService.put<IRoleGroup, IUpsertResult<IRoleGroup>>('roleGroup', roleGroup)
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