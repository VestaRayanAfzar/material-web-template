import {BaseController} from "./BaseController";

export class HomeController extends BaseController {
    public date:number;
    public static $inject = [];

    constructor() {
        super();
        this.date = Date.now();
        this.metaTagsService.setTitle('Vesta :: Home');
    }
}
