export interface IVariantClientAppSetting {
    env:string;
    api:string;
    asset:string;
    cache:{
        api:number;
    };
    viewport:{
        Small:number;
        Medium:number;
        Large:number;
    }
}

export let VariantClientAppSetting:IVariantClientAppSetting = {
    env: 'production',
    api: 'http://localhost:3000/api/v1',
    asset: 'http://localhost:8000/asset',
    cache: {
        api: 0
    },
    viewport: {
        Small: 425,
        Medium: 768,
        Large: 1024
    }
};