import {IClientAppSetting} from "../config/setting";
import {DateTimeFactory} from "vesta-datetime/DateTimeFactory";
import {IDateTime} from "vesta-datetime/datetime";

export function dateTimeFilter(Setting: IClientAppSetting) {
    let date = dateTimeFilter['defaultDateTime'] ?
        new dateTimeFilter['defaultDateTime']() : DateTimeFactory.create(Setting.locale);
    return function (value: number, format: string): string {
        if (!value) return '';
        format = format || 'Y/m/d';
        date.setTime(value);
        return date.format(format);
    }
}

dateTimeFilter['setDateTime'] = function (dateTime: IDateTime) {
    dateTimeFilter['defaultDateTime'] = dateTime;
};

dateTimeFilter.$inject = ['Setting'];