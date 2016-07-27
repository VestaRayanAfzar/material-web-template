import {NotificationService} from "../service/NotificationService";
import {FormService} from "../service/FormService";
import {AuthService} from "../service/AuthService";
import {ApiService} from "../service/ApiService";
import {LogService} from "../service/LogService";
import {ClientApp} from "../ClientApp";

export interface IBaseController {
    registerPermissions:()=>void;
}

export abstract class BaseController {
    protected apiService:ApiService = ApiService.getInstance();
    protected authService:AuthService = AuthService.getInstance();
    protected logService:LogService = LogService.getInstance();
    protected formService:FormService = FormService.getInstance();
    protected notificationService:NotificationService = NotificationService.getInstance();
    protected Setting = ClientApp.Setting;

    public static registerPermissions() {
    }
}