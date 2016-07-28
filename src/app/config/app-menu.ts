export interface IMenuItem {
    title:string;
    isAbstract?:boolean;
    url?:string;
    state?:string;
    children?:Array<IMenuItem>;
}

export const AppMenu:Array<IMenuItem> = [];
AppMenu.push({title: 'Home', state: 'home'});
AppMenu.push({title: 'About', state: 'about'});