import {IClientAppSetting} from "../config/setting";
import {Dictionary} from "../cmn/locale/Dictionary";


export function translateFilter(Setting:IClientAppSetting) {
    var dictionary:Dictionary = new Dictionary(Setting.locale);
    return function (key:string, ...placeholders:Array<string>):string {
        if (!key) return '';
        return dictionary.get(key) || key;
    }
}

translateFilter.$inject = ['Setting'];