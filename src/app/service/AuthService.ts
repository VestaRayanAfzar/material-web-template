import {IUser} from "../cmn/models/User";
import {IPermission} from "../cmn/models/Permission";
import {IRoleGroup} from "../cmn/models/RoleGroup";
import {IRole} from "../cmn/models/Role";

export interface IAclActions {
    [action:string]:boolean;
}

export interface IPermissionCollection {
    [resource:string]:Array<string>;
}

interface IStateResourceMap {
    [state:string]:IPermissionCollection;
}

export class AuthService {
    private tokenKeyName:string = 'auth-token';
    private userKeyName:string = 'userData';
    private storage:Storage = localStorage;
    private user:IUser = null;
    private permissions:IPermissionCollection = {};
    public static stateResourceMap:IStateResourceMap = {};
    public static $inject = [];

    constructor() {
        try {
            this.user = JSON.parse(this.storage.getItem(this.userKeyName));
            this.user ? this.login(this.user) : this.logout();
        } catch (e) {
            this.logout();
        }
    }

    public logout():void {
        this.storage.removeItem(this.userKeyName);
        var guest = {
            id: 0,
            roleGroups: [{
                name: 'guest',
                roles: [
                    {
                        name: 'guest', permissions: [{resource: 'account', action: 'login'}]
                    }
                ]
            }]
        };
        this.login(guest);
    }

    public login(user:IUser) {
        this.user = user;
            this.storage.setItem(this.userKeyName, JSON.stringify(user));
        this.extractPermissions();
        }

    private extractPermissions() {
        for (var i = this.user.roleGroups.length; i--;) {
            var roleGroup = <IRoleGroup>this.user.roleGroups[i];
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
        var requiredPermissions = AuthService.stateResourceMap[state];
        if (!requiredPermissions) return false;
        for (var resource in requiredPermissions) {
            if (requiredPermissions.hasOwnProperty(resource)) {
                var actions = requiredPermissions[resource];
                for (var i = actions.length; i--;) {
                    if (!this.isAllowed(resource, actions[i])) return false;
                }
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
}
