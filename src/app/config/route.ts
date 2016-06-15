import {ILocationProvider} from "angular";
import {IStateProvider, IUrlRouterProvider} from "angular-ui-router";

export interface IRouteFunction {
    ($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider):void;
}

export function router($stateProvider:IStateProvider, $locationProvider:ILocationProvider, $urlRouterProvider:IUrlRouterProvider) {
    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise('/');
    // ACCOUNT
    $stateProvider.state('login', {
        url: '/login',
        views: {
            'master': {
                templateUrl: 'tpl/account/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            }
        }
    });
    $stateProvider.state('logout', {
        url: '/logout',
        views: {
            'master': {
                templateUrl: 'tpl/login.html',
                controller: 'logoutController',
                controllerAs: 'vm'
            }
        }
    });
    // ACL
    $stateProvider.state('acl', {
        url: '/acl',
        views: {
            'master': {
                templateUrl: 'tpl/acl/acl.html',
                controller: 'aclController',
                controllerAs: 'vm'
            }
        }
    });
    $stateProvider.state('acl.role', {
        url: '/role',
        views: {
            'acl-content@acl': {
                templateUrl: 'tpl/acl/role/role.html',
                controller: 'roleController',
                controllerAs: 'vm'
            }
        }
    });
    $stateProvider.state('acl.roleGroup', {
        url: '/roleGroup',
        views: {
            'acl-content@acl': {
                templateUrl: 'tpl/acl/roleGroup/roleGroup.html',
                controller: 'roleGroupController',
                controllerAs: 'vm'
            }
        }
    });
    $stateProvider.state('acl.user', {
        url: '/user',
        views: {
            'acl-content@acl': {
                templateUrl: 'tpl/acl/user/user.html',
                controller: 'userController',
                controllerAs: 'vm'
            }
        }
    });
    // The Rest
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


