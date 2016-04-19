export interface IVariantClientAppSetting {
    env:string;
    api:string;
    cache:{
        api:number;
    };
}

export var VariantClientAppSetting:IVariantClientAppSetting = {
    env: 'development',
    api: 'http://localhost:3000',
    cache: {
        api: 10
    }
};