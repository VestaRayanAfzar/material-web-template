import {NotificationService} from "./NotificationService";
export class AppCacheService {
    private appCache:ApplicationCache;
    public static $inject = ['notificationService'];

    constructor(private notificationService:NotificationService) {
        this.appCache = window.applicationCache;
    }

    public update() {
        this.appCache.addEventListener('updateready', ()=> {
            this.notificationService.toast('Reloading browser to update the contents for offline browsing...');
            window.location.href = window.location.href;
        });
    }
}