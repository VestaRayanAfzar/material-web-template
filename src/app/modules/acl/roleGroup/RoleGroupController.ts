import {IRoleGroup, RoleGroup} from "../../../cmn/models/RoleGroup";
import {AuthService} from "../../../service/AuthService";
import {BaseController} from "../../BaseController";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {IQueryRequest, IQueryResult, IDeleteResult} from "vesta-schema/ICRUDResult";
import {ExtArray} from "vesta-util/ExtArray";
import {IRole} from "../../../cmn/models/Role";
import IDialogService = angular.material.IDialogService;
import IDialogOptions = angular.material.IDialogOptions;


export class RoleGroupController extends BaseController {
    private roleGroup:RoleGroup;
    public static $inject = ['apiService', 'formService', 'notificationService', '$mdDialog'];
    private roleGroupsList:ExtArray<IRoleGroup> = new ExtArray<IRoleGroup>();
    private selectedRoleGroupsList:Array<number> = [];
    private dtOption:any;
    private currentPage:number = 1;
    private busy:boolean = false;
    private roles:Array<IRole>;

    constructor(private apiService:ApiService, private formService:FormService, private notificationService:NotificationService, private $mdDialog:IDialogService) {
        super();
        this.dtOption = {
            showFilter: false,
            title: 'List of roleGroups',
            filter: '',
            order: 'id',
            rowsPerPage: [10, 20, 50],
            limit: 10,
            page: 1,
            total: 0,
            label: {text: 'Records', of: 'of'},
            loadMore: this.loadMore.bind(this)
        };
        this.getAllRoles();
        apiService.get<IQueryRequest<IRoleGroup>, IQueryResult<IRoleGroup>>('roleGroup')
            .then(result=> {
                if (result.error) return this.notificationService.toast(result.error.message);
                this.roleGroupsList.set(result.items);
                this.roleGroupsList.removeByProperty('name', 'admin');
                this.dtOption.total = result.total;
            })
    }

    private getAllRoles() {
        this.apiService.get<IRole,IQueryResult<IRole>>('role')
            .then(result=> {
                if (result.error) {
                    return this.notificationService.toast(result.error.message);
                }
                this.roles = result.items;
            })
    }

    public loadMore(page:number) {
        if (this.busy || page <= this.currentPage) return;
        this.busy = true;
        this.apiService.get<IQueryRequest<IRoleGroup>, IQueryResult<IRoleGroup>>('roleGroup', {
            limit: 10,
            page: ++this.currentPage
        })
            .then(result=> {
                if (result.error) return this.notificationService.toast(result.error.message);
                for (var i = 0; i < result.items.length; i++) {
                    this.roleGroupsList.push(result.items[i]);
                }
                this.dtOption.total = result.total;
                this.busy = false;
            })
    }

    public addRoleGroup(event:MouseEvent) {
        this.$mdDialog.show(<IDialogOptions>{
            controller: 'roleGroupAddController',
            controllerAs: 'vm',
            templateUrl: 'tpl/acl/roleGroup/roleGroupAddForm.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                roles: this.roles
            }
        }).then((roleGroup) => {
            this.roleGroupsList.push(roleGroup);
            this.notificationService.toast('New roleGroup has been added successfully');
        }).catch(err=> err && this.notificationService.toast(err.message))
    }

    public editRoleGroup(event:MouseEvent, id:number) {
        event.stopPropagation();
        this.$mdDialog.show(<IDialogOptions>{
            controller: 'roleGroupEditController',
            controllerAs: 'vm',
            templateUrl: 'tpl/acl/roleGroup/roleGroupEditForm.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                id: id,
                roles: this.roles
            }
        }).then((roleGroup:IRoleGroup) => {
            this.roleGroupsList[this.roleGroupsList.indexOfByProperty('id', roleGroup.id)] = roleGroup;
            this.notificationService.toast('roleGroup has been updated successfully');
        }).catch(err=> err && this.notificationService.toast(err.message))
    }

    public delRoleGroup(event:MouseEvent) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Delete confirmation')
            .textContent('Are you sure about deleting the select roleGroup')
            .targetEvent(event)
            .ok('Yes').cancel('No');
        this.$mdDialog.show(confirm).then(() => {
            this.apiService.delete<Array<number>, IDeleteResult>('roleGroup', this.selectedRoleGroupsList)
                .then(result=> {
                    if (result.error) return this.notificationService.toast(result.error.message);
                    this.roleGroupsList.removeByProperty('id', this.selectedRoleGroupsList);
                    this.selectedRoleGroupsList = [];
                    this.notificationService.toast(result.items.length + ' roleGroup has been deleted successfully');
                })
        })
    }

    public static registerPermissions() {
        AuthService.registerPermissions('acl.roleGroup', {'acl.roleGroup': ['read']});
    }
}