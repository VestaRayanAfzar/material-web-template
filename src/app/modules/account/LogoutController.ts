import {IStateService} from "angular-ui-router";
import {AuthService} from "../../service/AuthService";
import {ApiService} from "../../service/ApiService";
export class LogoutController {
    public static $inject = ['$state', 'authService', 'apiService'];

    constructor($state:IStateService, authService:AuthService, apiService:ApiService) {
        authService.logout();
        apiService.get('account/logout');
        $state.go('login');
    }

    static registerPermissions() {
        AuthService.registerPermissions('logout');
    }
}