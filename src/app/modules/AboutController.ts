import {BaseController} from "./BaseController";


export class AboutController extends BaseController {
    public static $inject = [];

    constructor() {
        super();
        this.metaTagsService.setTitle('Vesta :: About');
    }
}