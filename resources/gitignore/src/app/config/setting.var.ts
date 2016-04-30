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
    api: 'http://localhost:3000',
    static: 'http://localhost:8080',
    cache: {
        api: 10
    },
    viewport: {
        Break: 680
    }
};