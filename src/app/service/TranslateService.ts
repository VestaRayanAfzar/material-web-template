import {Dictionary} from "vesta-i18n/Dictionary";
import {I18nService} from "./I18nService";

export class TranslateService {
    private dictionary:Dictionary;
    public static $inject = ['i18nService'];

    constructor(i18nService:I18nService) {
        this.dictionary = i18nService.getDictionary();
    }

    public translate(key:string, ...placeholders:Array<string>):string {
        if (!key) return '';
        var tr = this.dictionary.lookup(key);
        if (!tr) return key;
        if (!placeholders.length) return tr || key;
        for (var i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace('%', placeholders[i]);
        }
        return tr;
    }
}