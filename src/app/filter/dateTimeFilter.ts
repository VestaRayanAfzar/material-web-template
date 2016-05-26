import {IClientAppSetting} from "../config/setting";
import {DateTimeFactory} from "vesta-datetime/DateTimeFactory";

export function dateTimeFilter(Setting:IClientAppSetting) {
    return function (value:number, format:string):string {
        if (!value) return '';
        format = format || 'Y/m/d';
        var date = DateTimeFactory.create(Setting.locale);
        date.setTime(value);
        return date.format(format);
    }
}

dateTimeFilter.$inject = ['Setting'];