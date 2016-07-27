import {IStateService} from "angular-ui-router";
import {AuthService} from "../../service/AuthService";
import {ApiService} from "../../service/ApiService";
import {IQueryResult} from "vesta-schema/ICRUDResult";
import {IUser} from "../../cmn/models/User";

export class LogoutController {
    public static $inject = ['$state', 'authService', 'apiService'];

    constructor($state:IStateService, authService:AuthService, apiService:ApiService) {
        authService.logout();
        apiService.get<any, IQueryResult<IUser>>('account/logout')
            .then(result=> {
                authService.updateUser(result.items[0]);
        $state.go('login');
            });
    }

    static registerPermissions() {
        AuthService.registerPermissions('logout');
    }
}