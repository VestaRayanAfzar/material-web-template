import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {IExtRootScopeService} from "../ClientApp";
import {IClientAppSetting} from "../config/setting";
import {Platform} from "vesta-util/Platform";

export interface IViewportSpyScope extends IScope {
}

export interface IViewport {
    isDevice:boolean;
    isSmallOrMedium:boolean;
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
            isSmallOrMedium: false/*,
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
            // this.viewportClasses = [];
            var width = document.documentElement.clientWidth,
                sizes = this.Setting.viewport;
            if (width > sizes.Large) {
                // this.viewportClasses.push('xlarge');
                this.$rootScope.vp.isSmallOrMedium = false;
            } else if (width > sizes.Medium) {
                // this.viewportClasses.push('large');
                this.$rootScope.vp.isSmallOrMedium = false;
            } else if (width > sizes.Small) {
                // this.viewportClasses.push('medium');
                // this.viewportClasses.push('small-medium');
                this.$rootScope.vp.isSmallOrMedium = true;
            } else {
                // this.viewportClasses.push('small');
                // this.viewportClasses.push('small-medium');
                this.$rootScope.vp.isSmallOrMedium = true;
            }
            if (!this.$rootScope.$$phase) {
                this.$rootScope.$apply();
            }
            // console.log(this.viewportClasses);
        };
        resizeSpy(null);
        window.addEventListener('resize', resizeSpy, false);
        return ()=> {
            window.removeEventListener('scroll', resizeSpy);
        };
    }

    public is(tag:string):boolean {
        // console.log(`calling is(${tag}): ${this.deviceClasses.indexOf(tag) >= 0 || this.viewportClasses.indexOf(tag) >= 0}`);
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
