export interface IMenuItem {
    title:string;
    isAbstract?:boolean;
    url:string;
    state?:string;
    children?:Array<IMenuItem>;
}

export const PrimaryAppMenu:Array<IMenuItem> = [
    {
        title: 'محصولات', url: 'product', state: 'product', children: [
        {title: 'براساس تولید کننده', url: '', isAbstract: true, children: []},
        {title: 'براساس دسته بندی', url: '', isAbstract: true, children: []}]
    },
    {title: 'خدمات', url: 'service', state: 'service'},
    {
        title: 'کاربردها', url: 'application', state: 'application', children: [
        {title: 'براساس دسته بندی', url: '', isAbstract: true, children: []},
        {title: 'براساس بازار', url: '', isAbstract: true, children: []}]
    },
    {title: 'راهکارها', url: 'solution', state: 'solution'},
    {title: 'رویدادها', url: 'event', state: 'event'},
    {title: 'مقالات', url: 'article', state: 'article'},
    {title: 'درباره ما', url: 'about', state: 'about'}
];

export const SecondaryAppMenu:Array<IMenuItem> = [
    {title: 'تماس با ما', url: 'contact', state: 'contact'},
    {title: 'پشتیبانی', url: 'support', state: 'support'},
    {title: 'ورود کاربران', url: 'login', state: 'login'},
    {title: 'خروج', url: 'logout', state: 'logout'}
];