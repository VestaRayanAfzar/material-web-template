export interface IVariantClientAppSetting {
    env:string;
    api:string;
    static:string;
    cache:{
        api:number;
    };
    viewport:{
        Break:number;
    }
}

export var VariantClientAppSetting:IVariantClientAppSetting = {
    env: 'development',
    api: 'http://vestarayanafzar.com/api/v1',
    static: 'http://vestarayanafzar.com/assets',
    cache: {
        api: 10
    },
    viewport: {
        Break: 680
    }
};