import IToastService = angular.material.IToastService;
import IToastOptions = angular.material.IToastOptions;

export class NotificationService {
    private static instance = null;
    static Positions = {Top: 'top', Center: 'center', Bottom: 'bottom'};
    static Duration = {Short: 'short', Long: 'long'};
    private durationToMs = {short: 3000, long: 7000};
    public static $inject = ['$mdToast'];

    constructor(private $mdToast:IToastService) {
        NotificationService.instance = this;
    }

    public toast(message:string, duration?:string, position?:string) {
        var hideDelay = duration ? this.durationToMs[duration] : 3000,
            position = position ? position : 'bottom';
        this.$mdToast.show(this.$mdToast.simple().textContent(message).position(position).hideDelay(hideDelay));
    }

    public static getInstance():NotificationService {
        return NotificationService.instance;
    }
}