import {IRole, Role} from "../../../cmn/models/Role";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {IQueryRequest, IQueryResult, IDeleteResult} from "vesta-schema/ICRUDResult";
import {ExtArray} from "vesta-util/ExtArray";
import {IPermission} from "../../../cmn/models/Permission";
import {AuthService} from "../../../service/AuthService";
import {BaseController} from "../../BaseController";
import IDialogService = angular.material.IDialogService;
import IDialogOptions = angular.material.IDialogOptions;

export interface IFormPermission {
    resource:string;
    actions:Array<{id:number,name:string}>;
}

export class RoleController extends BaseController {
    private role:Role;
    public rolesList:ExtArray<IRole> = new ExtArray<IRole>();
    public selectedRolesList:Array<number> = [];
    private dtOption:any;
    private currentPage:number = 1;
    private busy:boolean = false;
    public permissions:ExtArray<IFormPermission> = new ExtArray();
    public static $inject = ['authService', 'apiService', 'formService', 'notificationService', '$mdDialog'];

    constructor(authService:AuthService, private apiService:ApiService, private formService:FormService, private notificationService:NotificationService, private $mdDialog:IDialogService) {
        super();
        this.dtOption = {
            showFilter: false,
            title: 'List of roles',
            filter: '',
            order: 'id',
            rowsPerPage: [10, 20, 50],
            limit: 10,
            page: 1,
            total: 10/*,
             loadMore: this.loadMore.bind(this)*/
        };
        this.getAllPermissions();
        this.loadData();
    }

    private loadData() {
        this.apiService.get<IQueryRequest<IRole>, IQueryResult<IRole>>('role', {limit: 50})
            .then(result=> {
                if (result.error) return this.notificationService.toast(result.error.message);
                this.rolesList.set(result.items);
                // this.rolesList.removeByProperty('name', 'admin');
                this.dtOption.total = result.total;
            });
    }

    private getAllPermissions() {
        this.apiService.get<IQueryRequest<IPermission>,IQueryResult<IPermission>>('permission')
            .then(result=> {
                if (result.error) {
                    return this.notificationService.toast(result.error.message);
                }
                for (var i = 0, il = result.items.length; i < il; ++i) {
                    var p = result.items[i];
                    if (this.permissions.indexOfByProperty('resource', p.resource) < 0) {
                        this.permissions.push({resource: p.resource, actions: []});
                    }
                    this.permissions.findByProperty('resource', p.resource)[0].actions.push({
                        id: +p.id,
                        name: p.action
                    });
                }
            })
    }

    public loadMore(page:number) {
        if (this.busy || page <= this.currentPage) return;
        this.busy = true;
        this.apiService.get<IQueryRequest<IRole>, IQueryResult<IRole>>('role', {
            limit: 10,
            page: ++this.currentPage
        })
            .then(result=> {
                if (result.error) return this.notificationService.toast(result.error.message);
                for (var i = 0; i < result.items.length; i++) {
                    this.rolesList.push(result.items[i]);
                }
                this.dtOption.total = result.total;
                this.busy = false;
            })
    }

    public addRole(event:MouseEvent) {
        this.$mdDialog.show(<IDialogOptions>{
            controller: 'roleAddController',
            controllerAs: 'vm',
            templateUrl: 'tpl/acl/role/roleAddForm.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                permissions: this.permissions
            }
        })
            .then((role) => {
                this.rolesList.push(role);
                this.notificationService.toast('New role has been added successfully');
            })
    }

    public editRole(event:MouseEvent, id:number) {
        this.$mdDialog.show(<IDialogOptions>{
            controller: 'roleEditController',
            controllerAs: 'vm',
            templateUrl: 'tpl/acl/role/roleEditForm.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                id: id,
                permissions: this.permissions
            }
        })
            .then((role:IRole) => {
                this.rolesList[this.rolesList.indexOfByProperty('id', role.id)] = role;
                this.notificationService.toast('role has been updated successfully');
            })
    }

    public delRole(event:MouseEvent) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Delete confirmation')
            .textContent('Are you sure about deleting the select role')
            .targetEvent(event)
            .ok('Yes').cancel('No');
        this.$mdDialog.show(confirm).then(() => {
            this.apiService.delete<Array<number>, IDeleteResult>('role', this.selectedRolesList)
                .then(result=> {
                    if (result.error) return this.notificationService.toast(result.error.message);
                    this.rolesList.removeByProperty('id', result.items);
                    this.selectedRolesList = [];
                    this.notificationService.toast(result.items.length + ' role has been deleted successfully');
                })
        })
    }

    static registerPermissions() {
        AuthService.registerPermissions('acl.role', {'acl.role': ['read']});
    }
}