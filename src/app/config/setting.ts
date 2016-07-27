import {IVariantClientAppSetting, VariantClientAppSetting} from "./setting.var";

export interface IClientAppSetting extends IVariantClientAppSetting {
    name:string;
    version:{app:string, api:string};
    locale:string;
}

export let setting:IClientAppSetting = {
    name: 'materialWebTemplate',
    version: {
        app: '0.1.0',
        api: 'v1'
    },
    locale: 'fa-IR',
    api: VariantClientAppSetting.api,
    asset: VariantClientAppSetting.asset,
    env: VariantClientAppSetting.env,
    cache: VariantClientAppSetting.cache,
    viewport: VariantClientAppSetting.viewport
};
