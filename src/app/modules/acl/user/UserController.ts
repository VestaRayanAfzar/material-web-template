import {IUser, User} from "../../../cmn/models/User";
import {ApiService} from "../../../service/ApiService";
import {FormService} from "../../../service/FormService";
import {NotificationService} from "../../../service/NotificationService";
import {IQueryRequest, IQueryResult, IDeleteResult} from "vesta-schema/ICRUDResult";
import {ExtArray} from "vesta-util/ExtArray";
import {AuthService} from "../../../service/AuthService";
import {BaseController} from "../../BaseController";
import IDialogService = angular.material.IDialogService;
import IDialogOptions = angular.material.IDialogOptions;


export class UserController extends BaseController {
    private user:User;
    public static $inject = ['apiService', 'formService', 'notificationService', '$mdDialog'];
    private usersList:ExtArray<IUser> = new ExtArray<IUser>();
    private selectedUsersList:Array<number> = [];
    private dtOption:any;
    private currentPage:number = 1;
    private busy:boolean = false;

    constructor(private apiService:ApiService, private formService:FormService, private notificationService:NotificationService, private $mdDialog:IDialogService) {
        super();
        this.dtOption = {
            showFilter: false,
            title: 'List of users',
            filter: '',
            order: 'id',
            rowsPerPage: [10, 20, 50],
            limit: 10,
            page: 1,
            total: 0,
            label: {text: 'Records', of: 'of'},
            loadMore: this.loadMore.bind(this)
        };
        apiService.get<IQueryRequest<IUser>, IQueryResult<IUser>>('acl/user')
            .then(result=> {
                if (result.error) return this.notificationService.toast(result.error.message);
                this.usersList.set(result.items);
                this.dtOption.total = result.total;
            })
    }

    public loadMore(page:number) {
        if (this.busy || page <= this.currentPage) return;
        this.busy = true;
        this.apiService.get<IQueryRequest<IUser>, IQueryResult<IUser>>('acl/user', {
            limit: 10,
            page: ++this.currentPage
        })
            .then(result=> {
                if (result.error) return this.notificationService.toast(result.error.message);
                for (var i = 0; i < result.items.length; i++) {
                    this.usersList.push(result.items[i]);
                }
                this.dtOption.total = result.total;
                this.busy = false;
            })
    }

    public addUser(event:MouseEvent) {
        this.$mdDialog.show(<IDialogOptions>{
            controller: 'userAddController',
            controllerAs: 'vm',
            templateUrl: 'tpl/acl/user/userAddForm.html',
            parent: angular.element(document.body),
            targetEvent: event
        }).then((user) => {
            this.usersList.push(user);
            this.notificationService.toast('New user has been added successfully');
        }).catch(err=> err && this.notificationService.toast(err.message))
    }

    public editUser(event:MouseEvent, id:number) {
        this.$mdDialog.show(<IDialogOptions>{
            controller: 'userEditController',
            controllerAs: 'vm',
            templateUrl: 'tpl/acl/user/userEditForm.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                id: id
            }
        }).then((user:IUser) => {
            this.usersList[this.usersList.indexOfByProperty('id', user.id)] = user;
            this.notificationService.toast('user has been updated successfully');
        }).catch(err=> err && this.notificationService.toast(err.message))
    }

    public delUser(event:MouseEvent) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Delete confirmation')
            .textContent('Are you sure about deleting the select user')
            .targetEvent(event)
            .ok('Yes').cancel('No');
        this.$mdDialog.show(confirm).then(() => {
            this.apiService.delete<Array<number>, IDeleteResult>('acl/user', this.selectedUsersList)
                .then(result=> {
                    if (result.error) return this.notificationService.toast(result.error.message);
                    this.usersList.removeByProperty('id', this.selectedUsersList);
                    this.selectedUsersList = [];
                    this.notificationService.toast(result.items.length + ' user has been deleted successfully');
                })
        })
    }

    static registerPermissions() {
        AuthService.registerPermissions('acl.user', {'acl.user': ['read']});
    }
}