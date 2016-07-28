import {MetaTagsController} from "../directive/metaTags";
import {IExtRootScopeService} from "../ClientApp";

export class MetaTagsService {
    private static instance:MetaTagsService;
    private tagController:MetaTagsController;
    public static $inject = ['$rootScope'];

    constructor(private $rootScope:IExtRootScopeService) {
        MetaTagsService.instance = this;
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

    public static getInstance() {
        return MetaTagsService.instance;
    }
}