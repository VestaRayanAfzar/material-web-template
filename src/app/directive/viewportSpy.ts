import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";
import {IExtRootScopeService} from "../ClientApp";
import {IClientAppSetting} from "../config/setting";
import {Platform} from "vesta-util/Platform";

export interface IViewportSpyScope extends IScope {
}

export interface IViewport {
    isDevice:boolean;
    isSmallOrMedium:boolean;
}

export class ViewportSpyController {
    private DEVICE_CLASS = 'is-device';
    private shrinkedHeaderHeight = 64;
    public static $inject = ['$scope', '$element', '$rootScope', 'Setting'];

    constructor(private $scope:IViewportSpyScope, private $element:IAugmentedJQuery, private $rootScope:IExtRootScopeService,
                private Setting:IClientAppSetting) {
        $rootScope.vp = {
            isDevice: false,
            isSmallOrMedium: false
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
        if (Platform.isDevice()) {
            document.body.classList.add(this.DEVICE_CLASS);
            this.$rootScope.vp.isDevice = true;
        } else {
            this.$rootScope.vp.isDevice = false;
            document.body.classList.remove(this.DEVICE_CLASS);
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
        var resizeSpy = () => {
            if (timer) {
                clearTimeout(timer);
                return timer = setTimeout(resizeSpy, delay);
            }
            var width = document.documentElement.clientWidth,
                sizes = this.Setting.viewport;
            if (width > sizes.Large) {
                this.$rootScope.vp.isSmallOrMedium = false;
            } else if (width > sizes.Medium) {
                this.$rootScope.vp.isSmallOrMedium = false;
            } else if (width > sizes.Small) {
                this.$rootScope.vp.isSmallOrMedium = true;
            } else {
                this.$rootScope.vp.isSmallOrMedium = true;
            }
            if (!this.$rootScope.$$phase) {
                this.$rootScope.$digest();
            }
        };
        resizeSpy();
        window.addEventListener('resize', resizeSpy, false);
        return ()=> {
            window.removeEventListener('scroll', resizeSpy);
        };
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
