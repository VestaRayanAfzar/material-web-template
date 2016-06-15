import {IRole, Role} from "../../../cmn/models/Role";
import {Err} from "vesta-util/Err";
import {IUpsertResult} from "vesta-schema/ICRUDResult";
import {IFormController} from "angular";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {ExtArray} from "vesta-util/ExtArray";
import {IFormPermission} from "./RoleController";
import {BaseController} from "../../BaseController";
import IDialogService = angular.material.IDialogService;


export class RoleAddController extends BaseController {
    private role:Role;
    private roleForm:IFormController;
    public permissions:ExtArray<IFormPermission> = new ExtArray();
    public selectedPermissions = {};
    public static $inject = ['apiService', 'formService', 'notificationService', '$mdDialog', 'locals'];

    constructor(private apiService:ApiService, private formService:FormService, private notificationService:NotificationService,
                private $mdDialog:IDialogService, private locals:any) {
        super();
        this.role = new Role();
        this.permissions = locals.permissions;
    }

    public closeFormModal() {
        this.$mdDialog.cancel();
    }

    public addRole() {
        var validate = this.formService.evaluate(this.role.validate(), this.roleForm);
        if (!validate) return;
        var role = this.role.getValues<IRole>();
        role.permissions = [];
        for (var id in this.selectedPermissions) {
            if (this.selectedPermissions.hasOwnProperty(id) && this.selectedPermissions[id]) {
                role.permissions.push(id);
            }
        }
        this.apiService.post<IRole, IUpsertResult<IRole>>('role', role)
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