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
    api: 'http://localhost:3000/api/v1',
    static: 'http://localhost:8000/assets',
    cache: {
        api: 10
    },
    viewport: {
        Break: 680
    }
};