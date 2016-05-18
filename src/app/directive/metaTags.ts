import {IScope, IDirective, IAugmentedJQuery} from "angular";
import {MetaTagsService} from "../service/MetaTagsService";

export interface IMetaTagsScope extends IScope {
}


export class MetaTagsController {

    public static $inject = ['$scope', '$element', 'metaTagsService'];

    constructor(private $scope:IMetaTagsScope, private $element:IAugmentedJQuery, metaTagsService:MetaTagsService) {
        metaTagsService.register(this);
    }

    public update(tagName, tagContent) {
        var tag:HTMLMetaElement = <HTMLMetaElement>this.$element[0].querySelector(`meta[name=${tagName}]`);
        tag.setAttribute('content', tagContent);
    }
}

/**
 * @ngdoc directive
 * @name metaTags
 * @restrict A
 *
 */

export function metaTags():IDirective {
    return {
        restrict: 'A',
        controller: MetaTagsController,
        controllerAs: 'ctrl',
        bindToController: true,
        scope: {}
    }
}
