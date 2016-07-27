import {IScope, IDirective, IAugmentedJQuery, IAttributes} from "angular";


export interface ISliderItem {
    title:string;
    desc:string;
    image:string;
    link:string;
}

export interface ICarouselScope extends IScope {
    vm:CarouselController;
    items:Array<ISliderItem>;
} 

export class CarouselController {
    public items:Array<ISliderItem> = [];
    public static $inject = ['$scope', '$element'];

    constructor(private $scope:ICarouselScope, private $element:IAugmentedJQuery) {
        $scope.vm = this;
    }

    public pause() {
    }

    public resume() {
    }

}

/**
 * @ngdoc directive
 * @name carousel
 * @restrict E
 * 
 * @param {ISliderItem} items
 *
 */

export function carousel():IDirective {
    return {
        restrict: 'E',
        replace: true,
        template: `<div class="carousel">
                <div class="crsl-wrapper">
                    <div class="crsl-item out" ng-repeat="item in items" style="background-image: url('{{item.image}}')"></div>
                </div>
                <div class="crsl-indicator">
                    <div class="crsl-ind-item" ng-repeat="item in items" ng-click="gotoIndex($index)">
                        <div>
                            <h3>{{item.title}}</h3>
                            <p>{{item.desc}}</p>
                            <a href="{{item.link}}" class="md-button md-primary md-raised">More...</a>
                        </div>
                    </div>
                </div>
            </div>`,
        controller: CarouselController,
        controllerAs: 'ctrl',
        scope: {
            items: '='
        },
        link: function (scope:ICarouselScope, $element:IAugmentedJQuery, attrs:IAttributes) {
            var timer, delay = 7000, items, thumbs;
            var currItemIndex = 0;
            scope['gotoIndex'] = (index:number)=> {
                if (!items || !items.length) {
                    items = $element[0].querySelectorAll('.crsl-item');
                    thumbs = $element[0].querySelectorAll('.crsl-ind-item');
                    return setTimeout(()=>scope['gotoIndex'](index), 100);
                }
                items[currItemIndex].classList.remove('in');
                thumbs[currItemIndex].classList.remove('selected');
                currItemIndex = index % items.length;
                items[currItemIndex].classList.add('in');
                thumbs[currItemIndex].classList.add('selected');
                clearTimeout(timer);
                timer = setTimeout(()=>scope['gotoIndex'](currItemIndex + 1), delay);
            };
            scope['gotoIndex'](0);
            /*window.addEventListener('visibilitychange', ()=> {
                console.log('out');
            }, false);
            window.addEventListener('focus', ()=> {
                console.log('in');
            }, false);*/
            scope.$on('$destroy', ()=> {
                clearTimeout(timer);
            })
        }
    }
}
