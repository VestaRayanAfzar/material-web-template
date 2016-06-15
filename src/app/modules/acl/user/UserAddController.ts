import {IUser, User} from "../../../cmn/models/User";
import {Err} from "vesta-util/Err";
import {IUpsertResult} from "vesta-schema/ICRUDResult";
import {IFormController} from "angular";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {BaseController} from "../../BaseController";
import IDialogService = angular.material.IDialogService;


export class UserAddController extends BaseController {
    private user:User;
    private userForm:IFormController;
    public static $inject = ['apiService', 'formService', 'notificationService', '$mdDialog'];

    constructor(private apiService:ApiService, private formService:FormService, private notificationService:NotificationService, private $mdDialog:IDialogService) {
        super();
        this.user = new User();
    }

    public closeFormModal() {
        this.$mdDialog.cancel();
    }

    public addUser() {
        var validate = this.formService.evaluate(this.user.validate(), this.userForm);
        if (!validate) return;
        var user = this.user.getValues<IUser>();
        this.apiService.post<IUser, IUpsertResult<IUser>>('acl/user', user)
            .then(result=> {
                if (result.error) {
                    if (result.error.code == Err.Code.Validation) {
                        this.formService.evaluate(result.error['violations'], this.userForm);
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