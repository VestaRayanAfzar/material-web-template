import {IUser} from "../cmn/models/User";
import {IPermission} from "../cmn/models/Permission";
import {IRoleGroup} from "../cmn/models/RoleGroup";
import {IRole} from "../cmn/models/Role";
import {IExtRootScopeService} from "../ClientApp";

export interface IAclActions {
    [action:string]:boolean;
}

export interface IPermissionCollection {
    [resource:string]:Array<string>;
}

interface IStateResourceMap {
    [state:string]:IPermissionCollection;
}

export enum AclPolicy {Allow = 1, Deny}

export class AuthService {
    static instance:AuthService = null;
    static Events = {Login: 'auth-login', Logout: 'auth-logout'};
    private tokenKeyName:string = 'auth-token';
    private userKeyName:string = 'userData';
    private storage:Storage = localStorage;
    private user:IUser = null;
    private permissions:IPermissionCollection = {};
    private static defaultPolicy:AclPolicy = AclPolicy.Deny;
    public static stateResourceMap:IStateResourceMap = {};
    public static $inject = ['$rootScope'];

    constructor(private $rootScope:IExtRootScopeService) {
        AuthService.instance = this;
        try {
            this.user = JSON.parse(this.storage.getItem(this.userKeyName));
            this.user ? this.login(this.user) : this.logout();
        } catch (e) {
            this.logout();
        }
    }

    public logout():void {
        this.updateUser(<IUser>{});
        this.$rootScope.$broadcast(AuthService.Events.Logout, {});
    }

    public login(user:IUser) {
        this.updateUser(user);
        this.$rootScope.$broadcast(AuthService.Events.Login, {user});
        }

    private extractPermissions() {
        this.permissions = {};
        if (!this.user.roleGroups) return;
        for (var i = this.user.roleGroups.length; i--;) {
            var roleGroup = <IRoleGroup>this.user.roleGroups[i];
            if (!roleGroup) continue;
            for (var j = roleGroup.roles.length; j--;) {
                var role = <IRole>roleGroup.roles[j];
                for (var k = role.permissions.length; k--;) {
                    var permission = <IPermission>role.permissions[k];
                    if (!(permission.resource in this.permissions)) {
                        this.permissions[permission.resource] = [];
                    }
                    this.permissions[permission.resource].push(permission.action);
                }
            }
        }
        }

    public isLoggedIn():boolean {
        return !!(this.user && this.user.id);
    }

    public updateUser(user:IUser) {
        this.user = user;
        this.storage.setItem(this.userKeyName, JSON.stringify(user));
        this.extractPermissions();
    }

    public getUser() {
        return this.user;
    }

    public setToken(token:string):void {
        this.storage.setItem(this.tokenKeyName, token);
    }

    public getToken():string {
        return <string>this.storage.getItem(this.tokenKeyName);
    }

    /**
     Check if user has access to all actions of all resources
     */
    public hasAccessToState(state:string):boolean {
        if (!state) return true;
        var requiredPermissions = AuthService.stateResourceMap[state];
        if (!requiredPermissions) return AuthService.defaultPolicy == AclPolicy.Allow;
        for (let resources = Object.keys(requiredPermissions), i = resources.length; i--;) {
            let resource = resources[i];
                var actions = requiredPermissions[resource];
            for (let j = actions.length; j--;) {
                if (!this.isAllowed(resource, actions[j])) return false;
            }
        }
        return true;
    }

    /**
     Check if user has access to the action of resource
     */
    public isAllowed(resource:string, action:string):boolean {
        var userPermissions = this.permissions;
        var userActions = userPermissions[resource] || userPermissions['*'];
        if (!userActions) return AuthService.defaultPolicy == AclPolicy.Allow;
        return userActions && (userActions.indexOf('*') >= 0 || userActions.indexOf(action) >= 0);
    }

    /**
     Returns an object containing the actions which user has access to execute them.
     In case of * action, the CRUD actions will be added by default.
     Developer must take care of other actions (other than CRUD), in case of *
     */
    public getActionsOn(resource:string):IAclActions {
        var userPermissions = this.permissions;
        var userActions = userPermissions[resource] || userPermissions['*'];
        if (!userActions || !userActions.length) return <IAclActions>{};
        var granted:IAclActions = {};
        if (userActions.indexOf('*') >= 0) granted = {
            create: true,
            read: true,
            update: true,
            delete: true
        };
        for (var i = userActions.length; i--;) {
            granted[userActions[i]] = true;
        }
        return granted;
    }

    /**
     Same states will overwrite each others
     */
    public static registerPermissions(state:string, permissions?:IPermissionCollection) {
        AuthService.stateResourceMap[state] = permissions || {};
    }

    public static setDefaultPolicy(policy:AclPolicy) {
        AuthService.defaultPolicy = policy;
    }

    public static getInstance():AuthService {
        return AuthService.instance;
    }
}
