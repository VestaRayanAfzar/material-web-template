import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {IExtRootScopeService} from "../ClientApp";
import {IClientAppSetting} from "../config/setting";
import {Platform} from "vesta-util/Platform";

export interface IViewportSpyScope extends IScope {
}

export interface IViewport {
    isDevice:boolean;
    isAbove:boolean;
    isBelow:boolean;
    /*is:(tag:string)=>boolean;
     isOneOf:(...tags:Array<string>)=>boolean;*/
}

export class ViewportSpyController {
    private DEVICE_CLASS = 'is-device';
    private shrinkedHeaderHeight = 64;
    private deviceClasses:Array<string> = [];
    private viewportClasses:Array<string> = [];
    public static $inject = ['$scope', '$element', '$rootScope', 'Setting'];

    constructor(private $scope:IViewportSpyScope, private $element:IAugmentedJQuery, private $rootScope:IExtRootScopeService,
                private Setting:IClientAppSetting) {
        $rootScope.vp = {
            isDevice: false,
            isAbove: true,
            isBelow: false/*,
             is: this.is.bind(this),
             isOneOf: this.isOneOf.bind(this)*/
        };
        var scrollSpyRemover = this.spyOnScroll();
        var resizeSpyRemover = this.spyOnResize();
        this.detectPlatform();
        this.$scope.$on('$destroy', ()=> {
            scrollSpyRemover();
            resizeSpyRemover();
        });
    }

    private detectPlatform() {
        this.deviceClasses = [];
        if (Platform.isDevice()) {
            document.body.classList.add(this.DEVICE_CLASS);
            // this.viewportClasses.push('device');
            this.$rootScope.vp.isDevice = true;
        } else {
            this.$rootScope.vp.isDevice = false;
        }
    }

    private spyOnScroll():Function {
        var classList = document.body.classList;
        var toggledClassName = 'shrink-header';
        var scrollSpy = (event)=> {
            var hasClass = classList.contains(toggledClassName),
                passedOffset = document.body.scrollTop > this.shrinkedHeaderHeight;
            if (!hasClass && passedOffset) {
                classList.add(toggledClassName);
            } else if (hasClass && !passedOffset) {
                classList.remove(toggledClassName);
            }
        };
        window.addEventListener('scroll', scrollSpy, false);
        return ()=> {
            window.removeEventListener('scroll', scrollSpy);
        };
    }

    private spyOnResize():Function {
        var timer, delay = 500;
        var resizeSpy = (event) => {
            // console.log(window.screen);
            // console.log(document.documentElement.clientWidth, document.documentElement.clientHeight);
            if (timer) {
                clearTimeout(timer);
                return timer = setTimeout(resizeSpy, delay);
            }
            this.viewportClasses = [];
            var width = document.documentElement.clientWidth,
                sizes = this.Setting.viewport;
            if (width > sizes.Break) {
                this.$rootScope.vp.isAbove = true;
                this.$rootScope.vp.isBelow = false;
            } else {
                this.$rootScope.vp.isAbove = false;
                this.$rootScope.vp.isBelow = true;
            }
            if (!this.$rootScope.$$phase) {
                this.$rootScope.$apply();
            }
        };
        resizeSpy(null);
        window.addEventListener('resize', resizeSpy, false);
        return ()=> {
            window.removeEventListener('scroll', resizeSpy);
        };
    }

    public is(tag:string):boolean {
        console.log(`calling is(${tag}): ${this.deviceClasses.indexOf(tag) >= 0 || this.viewportClasses.indexOf(tag) >= 0}`);
        return this.deviceClasses.indexOf(tag) >= 0 || this.viewportClasses.indexOf(tag) >= 0;
    }

    private isOneOf(...tags:Array<string>) {
        for (var i = tags.length; i--;) {
            if (this.is(tags[i])) return true;
        }
        return false;
    }
}

/**
 * @ngdoc directive
 * @name viewportSpy
 * @restrict A
 *
 */

export function viewportSpy():IDirective {
    return {
        restrict: 'A',
        controller: ViewportSpyController,
        controllerAs: 'ctrl',
        bindToController: true,
        scope: {},
        link: function (scope:IViewportSpyScope, $element:IAugmentedJQuery, attrs:IAttributes) {

        }
    }
}
