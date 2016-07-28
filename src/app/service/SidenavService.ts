import {IQService, IPromise, IDeferred} from "angular";
import {SidenavController} from "../directive/sidenav";

export class SidenavService {
    private controllers:{[id:string]:SidenavController} = {};
    private deferredRequests:{[name:string]:Array<IDeferred<SidenavController>>} = {};
    public static $inject = ['$q'];

    constructor(private $q:IQService) {
    }

    /**
     * Each sidenav directive will register it's controller here
     *  after registering, this method checks if there are any deferred request for this sidenav and resolve them
     */
    public register(ctrl:SidenavController) {
        this.controllers[ctrl.componentId] = ctrl;
        // check if any service has been waiting for this directive to register
        let q = this.deferredRequests[ctrl.componentId];
        if (q) {
            for (var i = 0, il = q.length; i < il; ++i) {
                q[i].resolve(ctrl);
            }
            delete this.deferredRequests[ctrl.componentId];
        }
    }

    /**
     * If a sidenav has not registered it's controller, the promise will wait until it does, and then
     *  all those deferred wil be resolved
     */
    public get(componentId:string):IPromise<SidenavController> {
        let ctrl = this.controllers[componentId];
        if (ctrl) return this.$q.resolve(ctrl);
        let defer = this.$q.defer<SidenavController>();
        if (!this.deferredRequests[componentId]) {
            this.deferredRequests[componentId] = [];
        }
        this.deferredRequests[componentId].push(defer);
        return defer.promise;
    }
}