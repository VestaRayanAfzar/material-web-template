import {IPromise, IQService, IHttpService, IHttpPromise, IRequestShortcutConfig} from "angular";
import {IClientAppSetting} from "../config/setting";
import {Err} from "../cmn/Err";
import {AuthService} from "./AuthService";
import {StorageService} from "./StorageService";
import {NetworkService} from "./NetworkService";

export interface IFileKeyValue {
    [key:string]:File|Blob
}

interface IOfflineRequest<T> {
    type:string;
    edge:string;
    data:T;
    date:number;
}

interface IOnBeforeSendResult<T> {
    tobeContinue:boolean;
    error?:Err,
    reqConfig?:IRequestShortcutConfig;
    data?:T;
    reqHash:string;
}

export class ApiService {
    private endPoint:string = '';
    private offlineRequests = [];
    static $inject = ['$http', 'Setting', 'authService', '$q', 'storageService', 'networkService'];
    private enableCache:boolean;

    constructor(private $http:IHttpService, private Setting:IClientAppSetting, private authService:AuthService,
                private $q:IQService, private storageService:StorageService, private networkService:NetworkService) {
        this.endPoint = Setting.api;
        this.enableCache = !!Setting.cache.api;
        if (!(this.endPoint.charAt(this.endPoint.length - 1) == '/')) this.endPoint += '/';
    }

    private hashRequest<T>(method:string, edge:string, data:T) {
        var hashing = new jsSHA('SHA-1', 'TEXT');
        hashing.update(JSON.stringify({
            method: method,
            edge: edge,
            data: data
        }));
        return hashing.getHash('HEX');
    }

    private errorHandler<T>(response):Err {
        var resError,
            error = new Err();
        if (!response || !response.data) error = new Err(Err.Code.NoDataConnection);
        if (response.data && response.data.error) {
            resError = response.data.error;
        } else if (response.error) {
            resError = response.error;
        }
        for (var key in resError) {
            if (resError.hasOwnProperty(key)) {
                error[key] = resError[key];
            }
        }
        error.message = error.message || 'Something goes wrong!';
        error.code = error.code || Err.Code.Unknown;
        return error;
    }

    private requestHandler<T>(reqHash:string, req:IHttpPromise<any>):IPromise<T> {
        var deferred = this.$q.defer<T>();
        req.then((response)=> {
                if (!response || !response.data) return deferred.reject(new Err(Err.Code.NoDataConnection));
                this.onAfterReceive<T>(reqHash, response);
                deferred.resolve(response.data);
            })
            .catch(response=>deferred.reject(this.errorHandler(response)));
        return deferred.promise;
    }

    private onBeforeSend<T>(method:string, edge:string, data:T):IOnBeforeSendResult<T> {
        var result:IOnBeforeSendResult<T> = {
            tobeContinue: this.networkService.isOnline(),
            reqHash: ('upload' == method || 'delete' == method) ? '' : this.hashRequest<T>(method, edge, data)
        };
        if (!result.tobeContinue) {
            result.error = new Err(Err.Code.NoDataConnection);
            return result;
        }
        var token = this.authService.getToken();
        result.reqConfig = {headers: {}};
        if (token) {
            result.reqConfig.headers['X-Auth-Token'] = token;
        }
        return result;
    }

    private onAfterReceive<T>(reqHash:string, response):void {
        var tkn = response.headers('X-Auth-Token'),
            data = response.data;
        if (tkn) {
            this.authService.setToken(tkn);
        }
        if (data && reqHash && this.enableCache) {
            this.storageService.set<T>(reqHash, data);
        }
    }

    private loadOffline<T>(reqHash:string):IPromise<T> {
        var data = this.storageService.get<T>(reqHash);
        return data ? this.$q.resolve(data) : this.$q.reject(new Err(Err.Code.NoDataConnection));
    }

    public get<T extends Object, U>(edge:string, data?:T):IPromise<U> {
        var config:IOnBeforeSendResult<T> = this.onBeforeSend<T>('get', edge, data),
            urlData = data ? `?${window['param'](data)}` : '';
        if (!config.tobeContinue) return this.loadOffline<U>(config.reqHash);
        return this.requestHandler<U>(config.reqHash, this.$http.get(this.endPoint + edge + '?' + urlData.substr(1), config.reqConfig));
    }

    public post<T extends Object, U>(edge:string, data?:T):IPromise<U> {
        var config:IOnBeforeSendResult<T> = this.onBeforeSend<T>('post', edge, data);
        if (!config.tobeContinue) return this.loadOffline<U>(config.reqHash);
        data = data || <T>{};
        return this.requestHandler<U>(config.reqHash, this.$http.post(this.endPoint + edge, data, config.reqConfig));
    }

    public upload<T extends Object, U>(edge:string, files:IFileKeyValue, data?:T):IPromise<U> {
        var config:IOnBeforeSendResult<T> = this.onBeforeSend<T>('upload', edge, null),
            fd = new FormData();
        if (!config.tobeContinue) return this.$q.reject(new Err(Err.Code.NoDataConnection));
        if (data) {
            fd.append('data', JSON.stringify(data));
        }
        for (var fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                fd.append(fileName, files[fileName]);
            }
        }
        config.reqConfig.transformRequest = angular.identity;
        config.reqConfig.headers['content-type'] = undefined;
        return this.requestHandler<U>(config.reqHash, this.$http.post(this.endPoint + edge, fd, config.reqConfig));
    }

    public put<T extends Object, U>(edge:string, data?:T):IPromise<U> {
        var config:IOnBeforeSendResult<T> = this.onBeforeSend<T>('put', edge, data);
        if (!config.tobeContinue) return this.loadOffline(config.reqHash);
        data = data || <T>{};
        return this.requestHandler<U>(config.reqHash, this.$http.put(this.endPoint + edge, data, config.reqConfig));
    }

    public delete<T extends Object, U>(edge:string, data?:T):IPromise<U> {
        var config:IOnBeforeSendResult<T> = this.onBeforeSend<T>('delete', edge, data);
        data = data || <T>{};
        return this.requestHandler<U>(config.reqHash, this.$http.post(this.endPoint + edge, data, config.reqConfig));
    }
}
