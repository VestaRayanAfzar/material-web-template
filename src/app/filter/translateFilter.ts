import {TranslateService} from "../service/TranslateService";

export function translateFilter(translationService:TranslateService) {
    return function (key:string, ...placeholders:Array<string>):string {
        if (!key) return '';
        return translationService.translate(key, ...placeholders) || key;
    }
}

translateFilter.$inject = ['translateService'];