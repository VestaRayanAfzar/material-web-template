import {IClientAppSetting} from "../config/setting";
import {ILocale} from "vesta-i18n/ILocale";
import {I18N} from "vesta-i18n/I18N";
import {Dictionary, IVocabs} from "vesta-i18n/Dictionary";
import {faIR} from "vesta-locale-fa-ir/fa-IR";
import {enUS} from "vesta-locale-en-us/en-US";
import {ApiService} from "./ApiService";
import {DateTimeFactory} from "vesta-datetime/DateTimeFactory";
import {PersianDate} from "vesta-datetime-persian/PersianDate";
import {GregorianDate} from "vesta-datetime-gregorian/GregorianDate";

export class I18nService {
    private i18nLocale:ILocale;
    private dictionary:Dictionary;
    public static $inject = ['Setting', 'apiService'];

    constructor(private Setting:IClientAppSetting, private apiService:ApiService) {
        this.initLocales();
    }

    private initLocales() {
        I18N.registerLocale(faIR);
        I18N.registerLocale(enUS);
        I18N.registerDictionary(faIR.code);
        I18N.registerDictionary(enUS.code);
        DateTimeFactory.register(faIR.code, PersianDate);
        DateTimeFactory.register(enUS.code, GregorianDate);
        //
        this.i18nLocale = I18N.getLocale(this.Setting.locale);
        this.dictionary = I18N.getDictionary(this.Setting.locale);
        //
        // this.apiService.get<any, IVocabs>(`vocabs/${this.Setting.locale}`)
        //     .then(vocabs=>this.dictionary.inject(vocabs));
    }

    public get(property?:string) {
        if (!property) return this.i18nLocale;
        return this.i18nLocale[property];
    }

    public getDictionary():Dictionary {
        return this.dictionary;
    }
}