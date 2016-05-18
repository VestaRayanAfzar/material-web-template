import {MetaTagsController} from "../directive/metaTags";
import {IExtRootScopeService} from "../ClientApp";

export class MetaTagsService {
    private tagController:MetaTagsController;
    private q:Array<Function> = [];
    public static $inject = ['$rootScope'];

    constructor(private $rootScope:IExtRootScopeService) {

    }

    public register(controller:MetaTagsController) {
        this.tagController = controller;
    }

    public setDescription(description:string) {
        this.tagController.update('description', description);
    }

    public setTitle(title:string) {
        this.$rootScope.pageTitle = title;
    }

    public setKeywords(...keywords:Array<string>) {
        this.tagController.update('keywords', keywords.join(','));
    }
}