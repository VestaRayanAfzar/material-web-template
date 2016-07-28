import {User, IUser} from "../../cmn/models/User";
import {Err} from "vesta-util/Err";
import {IUpsertResult} from "vesta-schema/ICRUDResult";
import {IStateService} from "angular-ui-router";
import {AuthService} from "../../service/AuthService";
import {BaseController} from "../BaseController";
import IDialogService = angular.material.IDialogService;
import IDialogOptions = angular.material.IDialogOptions;
import IFormController = angular.IFormController;


export class LoginController extends BaseController {
    private user:User;
    private userForm:IFormController;
    public static $inject = ['$state'];

    constructor(private $state:IStateService) {
        super();
        this.user = new User();
        this.metaTagsService.setTitle('Login');
    }

    public login() {
        if (this.userForm.$dirty == false) return;
        var validate = this.formService.evaluate(this.user.validate('username', 'password'), this.userForm);
        if (!validate) return;
        var user = this.user.getValues<IUser>('username', 'password');
        this.apiService.post<IUser, IUpsertResult<IUser>>('account/login', user)
            .then(result=> {
                if (result.error) {
                    if (result.error.code == Err.Code.Validation) {
                        this.formService.evaluate(result.error['violations'], this.userForm);
                    }
                    return this.notificationService.toast(result.error.message);
                }
                if (result.items.length == 1) {
                    this.authService.login(result.items[0]);
                    return this.$state.go('home');
                }
                this.notificationService.toast('نام کاربری یا کلمه عبور وارد شده صحیح نمی باشد');
            });
    }

    static registerPermissions() {
        AuthService.registerPermissions('login', {account: ['login']});
    }
}