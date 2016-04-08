import {NotificationService} from "../service/NotificationService";

export class HomeController {
    public date:number;
    public static $inject = ['notificationService'];

    constructor(private notificationService:NotificationService) {
        this.date = Date.now();
    }
}
