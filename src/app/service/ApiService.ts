import {IPromise, IQService, IHttpService, IHttpPromise, IRequestShortcutConfig, IDeferred} from "angular";
import {Err} from "vesta-util/Err";
import {AuthService} from "./AuthService";
import {NetworkService} from "./NetworkService";
import {ClientApp} from "../ClientApp";

export interface IFileKeyValue {
    [key: string]: File|Blob|Array<File|Blob>;
}

interface IOnBeforeSendResult {
    error: Err;
    reqConfig: IRequestShortcutConfig;
    canceler: IDeferred<string>;
}

interface ICancellablePromise<T> extends IPromise<T> {
    cancel: ()=>void;
}

export class ApiService {
    private static instance: ApiService;
    private endPoint: string = '';
    static $inject = ['$http', 'authService', '$q', 'networkService'];
    private enableCache: boolean;

    constructor(private $http: IHttpService, private authService: AuthService, private $q: IQService, private networkService: NetworkService) {
        this.endPoint = ClientApp.Setting.api;
        this.enableCache = !!ClientApp.Setting.cache.api;
        if (!/\/$/.exec(this.endPoint)) this.endPoint += '/';
        ApiService.instance = this;
    }

    private errorHandler(response): Err {
        let resError,
            error = new Err();
        if (!response || !response.data) {
            error = new Err(Err.Code.NoDataConnection);
        } else if (response.data && response.data.error) {
            resError = response.data.error;
        } else if (response.error) {
            resError = response.error;
        }
        for (let key in resError) {
            if (resError.hasOwnProperty(key)) {
                error[key] = resError[key];
            }
        }
        error.message = error.message || 'Something goes wrong!';
        error.code = error.code || Err.Code.Unknown;
        return error;
    }

    private requestHandler<T>(req: IHttpPromise<any>, canceler: IDeferred<any>): ICancellablePromise<T> {
        let deferred = this.$q.defer<T>();
        req.then((response)=> {
                if (!response || !response.data) return deferred.reject(new Err(Err.Code.NoDataConnection));
            if (response.data.error) throw response;
            this.extractToken(response);
            // this.onAfterReceive<T>(response);
                deferred.resolve(response.data);
        }).catch(response=> {
            this.extractToken(response);
            deferred.reject(this.errorHandler(response))
        });
        (<ICancellablePromise<T>>deferred.promise).cancel = ()=> {
            canceler.resolve();
        };
        return <ICancellablePromise<T>>deferred.promise;
    }

    private onBeforeSend(): IOnBeforeSendResult {
        let tobeContinue = this.networkService.isOnline();
        let result: IOnBeforeSendResult = <IOnBeforeSendResult>{};
        if (!tobeContinue) {
            result.error = new Err(Err.Code.NoDataConnection);
            return result;
        }
        // token
        let token = this.authService.getToken();
        result.reqConfig = {headers: {}};
        if (token) {
            result.reqConfig.headers['X-Auth-Token'] = token;
        }
        // enabling canceling request
        result.canceler = this.$q.defer<any>();
        result.reqConfig.timeout = result.canceler.promise;
        return result;
    }

    private extractToken(response) {
        let tkn = response.headers('X-Auth-Token');
        if (tkn) {
            this.authService.setToken(tkn);
        }
    }

    public get<T, U>(edge: string, data?: T): ICancellablePromise<U> {
        let config = this.onBeforeSend(),
            urlData = data ? `?${window['param'](data)}` : '';
        if (config.error) return <ICancellablePromise<U>>this.$q.reject(config.error);
        return this.requestHandler<U>(this.$http.get(this.endPoint + edge + '?' + urlData.substr(1), config.reqConfig), config.canceler);
    }

    public post<T, U>(edge: string, data?: T): ICancellablePromise<U> {
        let config = this.onBeforeSend();
        if (config.error) return <ICancellablePromise<U>>this.$q.reject(config.error);
        data = data || <T>{};
        return this.requestHandler<U>(this.$http.post(this.endPoint + edge, data, config.reqConfig), config.canceler);
    }

    public upload<T, U>(edge: string, files: IFileKeyValue, data?: T): ICancellablePromise<U> {
        let config = this.onBeforeSend(),
            fd = new FormData();
        if (config.error) return <ICancellablePromise<U>>this.$q.reject(config.error);
        if (data) {
            fd.append('data', JSON.stringify(data));
        }
        for (let i = 0, keys = Object.keys(files), il = keys.length; i < il; i++) {
            let fileName = keys[i];
            if (files[fileName] instanceof Array) {
                let fileList = <Array<File>> files[fileName];
                for (let j = fileList.length; j--;) {
                    fd.append(fileName, fileList[j]);
                }
            } else {
                fd.append(fileName, files[fileName]);
            }
        }
        config.reqConfig.transformRequest = angular.identity;
        config.reqConfig.headers['content-type'] = undefined;
        return this.requestHandler<U>(this.$http.post(this.endPoint + edge, fd, config.reqConfig), config.canceler);
    }

    public put<T, U>(edge: string, data?: T): ICancellablePromise<U> {
        let config = this.onBeforeSend();
        if (config.error) return <ICancellablePromise<U>>this.$q.reject(config.error);
        data = data || <T>{};
        return this.requestHandler<U>(this.$http.put(this.endPoint + edge, data, config.reqConfig), config.canceler);
    }

    public delete<T, U>(edge: string, data?: T): ICancellablePromise<U> {
        let config = this.onBeforeSend(),
            urlData = data ? `?${window['param'](data)}` : '';
        if (config.error) return <ICancellablePromise<U>>this.$q.reject(config.error);
        return this.requestHandler<U>(this.$http.delete(`${this.endPoint}${edge}?${urlData}`, config.reqConfig), config.canceler);
    }

    public static getInstance(): ApiService {
        return ApiService.instance || null;
    }
}
