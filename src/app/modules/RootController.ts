import {IExtRootScopeService} from "../ClientApp";
import {SidenavService} from "../service/SidenavService";
import {IStateService} from "angular-ui-router";
import {AuthService} from "../service/AuthService";
import {BaseController} from "./BaseController";
import {IGroup} from "../cmn/models/Group";
import {AppMenuService, IMenuWithController} from "../service/AppMenuService";
import {IManufacturer} from "../cmn/models/Manufacturer";
import {ContentType} from "../cmn/enum/ContentType";

interface IMenuResult {
    brands:Array<IManufacturer>;
    markets:Array<IGroup>;
    categories:{[index:number]:Array<IGroup>};
}

export class RootController extends BaseController {
    public static $inject = ['$rootScope', '$state', 'sidenavService', 'appMenuService'];

    constructor(private $rootScope:IExtRootScopeService, private $state:IStateService, private sidenavService:SidenavService, private appMenuService:AppMenuService) {
        super();
        $rootScope.rvm = this;
        $rootScope.user = this.authService.getUser();
        // var stateChangeRemover=$rootScope.$on('$stateChangeSuccess',()=>)
        this.fetchMenuItems();
        let loginRemover = $rootScope.$on(AuthService.Events.Login, ($event, data)=> $rootScope.user = data.user);
        // var logoutRemover = $rootScope.$on(AuthService.Events.Logout, data=> $rootScope.user = );
    }

    public toggleSidenav(componentId:string) {
        let ctrl = this.sidenavService.get(componentId);
        if (!ctrl) {
            return this.logService.log(`RootController.toggleSidenav: component#${componentId} was not found`);
        }
        ctrl.toggle();
    }

    private fetchMenuItems() {
        let menuWithController:IMenuWithController;
        this.appMenuService.getMenu('primary-menu')
            .then(menu=> {
                menuWithController = menu;
                return this.apiService.get<IGroup, IMenuResult>('menu')
            })
            .then(result=> {
                let menuItems = menuWithController.items;
                // console.log(menuItems);
                // console.log(result);
                // categories
                // for each state, the children will be extracted from result and appended to the children
                for (let i = 0, il = menuItems.length; i < il; ++i) {
                    switch (menuItems[i].url) {
                        case 'product':
                            // extracting product categories ;;
                            // the first children of product menu item is '?????? ????? ?????'
                            let brandsSubmenu = menuItems[i].children[0];
                            for (let j = 0, jl = result.brands.length; j < jl; ++j) {
                                let brand = result.brands[j];
                                brandsSubmenu.children.push({
                                    title: brand.name,
                                    url: `brand/${this.genLink(brand.id, brand.name)}`
                                });
                            }
                            let productCategories = result.categories[ContentType.Product];
                            // the second child of product menu item is '?????? ???? ????'
                            let productCategorySubmenu = menuItems[i].children[0];
                            for (let j = 0, jl = productCategories.length; j < jl; ++j) {
                                let cat = productCategories[j];
                                productCategorySubmenu.children.push({
                                    title: cat.name,
                                    url: `product/category/${this.genLink(cat.id, cat.name)}`
                                });
                            }
                            break;
                        case 'application':
                            // extracting application categories
                            // the first child of application menu item is '?????? ???? ????'
                            let applicationCategories = result.categories[ContentType.Application];
                            let applicationCategoriesSubmenu = menuItems[i].children[0];
                            for (let j = 0, jl = applicationCategories.length; j < jl; ++j) {
                                let cat = applicationCategories[j];
                                applicationCategoriesSubmenu.children.push({
                                    title: cat.name,
                                    url: `application/category/${this.genLink(cat.id, cat.name)}`,
                                })
                            }
                            // the first child of application menu item is '?????? ?????'
                            let marketSubmenu = menuItems[i].children[1];
                            for (let j = 0, jl = result.markets.length; j < jl; ++j) {
                                let market = result.markets[j];
                                marketSubmenu.children.push({
                                    title: market.name,
                                    url: `application/market/${this.genLink(market.id, market.name)}`
                                })
    }
                            break;
                    }
                }
                menuWithController.ctrl.update();
            })
            .catch(err=> this.logService.error(err, 'RootController.toggleSidenav'));
    }
}