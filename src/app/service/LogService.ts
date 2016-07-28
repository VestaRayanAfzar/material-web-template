import {ApiService} from "./ApiService";
import {ClientApp} from "../ClientApp";
import {NotificationService} from "./NotificationService";

export class LogService {
    private static LogType = {Log: 'log', Info: 'info', Warn: 'warn', Error: 'error'};
    private static instance:LogService = null;
    private isProduction = true;
    public static $inject = ['apiService', 'notificationService'];

    constructor(private apiService:ApiService, private notificationService:NotificationService) {
        LogService.instance = this;
        this.isProduction = ClientApp.Setting.env === 'production';
    }

    private echo(logType:string, location:string, log:any) {
        if (this.isProduction) {
            // todo what to do ???
        } else {
            console[logType](location, log);
        }
    }

    public log(location:string, log:any) {
        this.echo(LogService.LogType.Log, location, log);
        }

    public warn(location:string, warning:any) {
        this.echo(LogService.LogType.Warn, location, warning);
    }

    public info(location:string, information:any) {
        this.echo(LogService.LogType.Info, location, information);
    }

    public error(location:string, error:any) {
        this.echo(LogService.LogType.Error, location, error);
    }

    public static getInstance():LogService {
        return LogService.instance;
    }
}