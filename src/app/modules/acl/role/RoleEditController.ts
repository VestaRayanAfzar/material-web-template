import {IRole, Role} from "../../../cmn/models/Role";
import {Err} from "vesta-util/Err";
import {IQueryResult, IUpsertResult, IQueryRequest} from "vesta-schema/ICRUDResult";
import {IFormController} from "angular";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {ExtArray} from "vesta-util/ExtArray";
import {IFormPermission} from "./RoleController";
import {IPermission} from "../../../cmn/models/Permission";
import {BaseController} from "../../BaseController";
import IDialogService = angular.material.IDialogService;


export class RoleEditController extends BaseController {
    private role:Role;
    private roleForm:IFormController;
    public permissions:ExtArray<IFormPermission> = new ExtArray();
    public selectedPermissions:any = {};
    public static $inject = ['apiService', 'formService', 'notificationService', '$mdDialog', 'locals'];

    constructor(private apiService:ApiService, private formService:FormService, private notificationService:NotificationService, private $mdDialog:IDialogService, private locals:any) {
        super();
        apiService.get<IQueryRequest<IRole>, IQueryResult<IRole>>('role/' + this.locals.id)
            .then(result=> {
                if (result.error) return $mdDialog.cancel(result.error);
                this.role = new Role(result.items[0]);
                this.role.status = !!this.role.status;
                for (var i = this.role.permissions.length; i--;) {
                    var p:IPermission = this.role.permissions[i];
                    this.selectedPermissions[p.id] = true;
                }
            })
            .catch(reason=>$mdDialog.cancel(reason));
        this.permissions = locals.permissions;
    }

    public closeFormModal() {
        this.$mdDialog.cancel();
    }

    public editRole() {
        if (this.roleForm.$dirty == false) {
            this.$mdDialog.cancel();
            return;
        }
        var validate = this.formService.evaluate(this.role.validate(), this.roleForm);
        if (!validate) return;
        var role = this.role.getValues<IRole>();
        role.permissions = [];
        for (var id in this.selectedPermissions) {
            if (this.selectedPermissions.hasOwnProperty(id) && this.selectedPermissions[id]) {
                role.permissions.push(id);
            }
        }
        this.apiService.put<IRole, IUpsertResult<IRole>>('role', role)
            .then(result=> {
                if (result.error) {
                    if (result.error.code == Err.Code.Validation) {
                        this.formService.evaluate(result.error['violations'], this.roleForm);
                    }
                    return this.notificationService.toast(result.error.message);
                }
                this.$mdDialog.hide(result.items[0]);
            })
            .catch(reason=> {
                this.$mdDialog.cancel(reason);
            });
    }
}