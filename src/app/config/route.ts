import {ILocationProvider} from "angular";
import {IStateProvider, IUrlRouterProvider} from "angular-ui-router";

export interface IRouteFunction {
    ($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider):void;
}

export function router($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
        url: '/',
        views: {
            'master': {
                templateUrl: 'tpl/home.html',
                controller: 'homeController',
                controllerAs: 'vm'
            }
        }
    });
    $stateProvider.state('about', {
        url: '/about',
        views: {
            'master': {
                templateUrl: 'tpl/about.html',
                controller: 'aboutController',
                controllerAs: 'vm'
            }
        }
    });
    ///<vesta:ngRouter/>
}


