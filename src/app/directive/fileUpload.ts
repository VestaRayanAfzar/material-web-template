import {IDirective, IScope, IAugmentedJQuery, IAttributes, INgModelController} from "angular";
import {FileMemeType} from "vesta-util/FileMemeType";

interface IFileUploadScope extends IScope {
    ngModel:Array<File|string>|File|string;
    ctrl:FileUploadController;
}

interface IFileUploadAttrs extends IAttributes {
    multiple:boolean;
}

interface IFileDescription {
    isAddress:boolean;
    isImage:boolean;
    ext?:string;
    types?:Array<string>;
}

export class FileUploadController {
    private files:Array<File|string>;
    private uploadWrapper:HTMLDivElement;
    private srcWatchRemover;
    private multiple:boolean;
    public ngModelController:INgModelController;
    static $inject = ['$scope', '$element'];

    constructor(private $scope:IFileUploadScope, private $element:IAugmentedJQuery) {
        $scope.ctrl = this;
        this.multiple = $element.attr('multiple') == 'multiple';
        this.srcWatchRemover = $scope.$watch(()=>$scope.ngModel, (src:string, oldSrc:string)=> {
            if (!src || src == oldSrc) return;
            this.createFileWrapper(src);
        });
    }

    private parse(file:File|string):IFileDescription {
        let result:IFileDescription = {isAddress: false, isImage: false};
        let strValue = file.toString();
        if (strValue === '[object File]') {
            result.isImage = (<File>file).type.indexOf('image/') == 0;
            return result;
        }
        // src
        result.isAddress = true;
        let parts = /.+\.(.+)$/i.exec(strValue);
        if (parts[1]) {
            result.types = FileMemeType.getMeme(parts[1]);
            result.ext = parts[1];
            result.isImage = result.types[0].indexOf('image/') == 0;
        }
        return result;
    }

    private createFileWrapper(file:File|string) {
        let btnHasBeenRemoved = false;
        let wrapper:HTMLDivElement = document.createElement('div');
        wrapper.className = 'file-wrapper';
        let delBtn:HTMLSpanElement = document.createElement('span');
        delBtn.textContent = 'X';
        delBtn.className = 'del-btn';
        wrapper.appendChild(delBtn);
        this.uploadWrapper.appendChild(wrapper);

        let deleteHandler = (ev:MouseEvent)=> {
            btnHasBeenRemoved = true;
            this.uploadWrapper.removeChild(wrapper);
            ev.stopPropagation();
        };
        delBtn.addEventListener('click', deleteHandler);
        this.$scope.$on('$destroy', ()=> !btnHasBeenRemoved && delBtn.removeEventListener('click', deleteHandler));
        let fileDesc = this.parse(file);
        return fileDesc.isImage ?
            this.appendImage(wrapper, file, fileDesc) :
            this.appendFile(wrapper, file, fileDesc);
    }

    private appendImage(wrapper:HTMLDivElement, file:File|string, fileDesc:IFileDescription) {
        let image = new Image();
        if (fileDesc.isAddress) {
            image.src = <string>file;
        } else {
            var reader = new FileReader();
            reader.onload = (event)=> {
                this.$scope.$apply(()=> image.src = event.target['result']);
            };
            reader.readAsDataURL(<File>file);
        }
        wrapper.appendChild(image);
    }

    private appendFile(wrapper:HTMLDivElement, file:File|string, fileDesc:IFileDescription) {
        let placeholder = document.createElement('div');
        placeholder.className = 'file-placeholder';
        if (fileDesc.isAddress) {
        } else {
            placeholder.setAttribute('type', (<File>file).type);
        }
        wrapper.appendChild(placeholder);
    }

    public compile() {
        var element = this.$element[0];
        element.style.display = 'none';
        this.uploadWrapper = document.createElement('div');
        this.uploadWrapper.classList.add('file-upload');

        element.parentNode.insertBefore(this.uploadWrapper, element);
        this.uploadWrapper.addEventListener('click', function (e) {
            e.preventDefault();
            element.click();
        });
        let ctrl = this;
        element.onchange = function () {
            ctrl.srcWatchRemover &&  ctrl.srcWatchRemover();
            let files = this.files;
            if (!files.length) return;
            ctrl.ngModelController.$setDirty();
            if (ctrl.multiple) {
                let ngModel = [];
                for (let i = 0, il = files.length; i < il; ++i) {
                    let file = files[i];
                    ngModel.push(file);
                    ctrl.createFileWrapper(file);
                }
                ctrl.$scope.ngModel = ngModel;
            } else {
                ctrl.$scope.ngModel = files[0];
                ctrl.clear();
                ctrl.createFileWrapper(files[0]);
            }
        };
    }

    private clear() {
        this.uploadWrapper.innerHTML = '';
    }

    public init() {
    }
}

/**
 * @ngdoc directive
 * @name fileUpload
 * @restrict A
 *
 */

export function fileUpload():IDirective {
    return {
        restrict: 'A',
        require: 'ngModel',
        controller: FileUploadController,
        bindToController: false,
        controllerAs: 'ctrl',
        scope: {
            ngModel: '='
        },
        link(scope:IFileUploadScope, element:IAugmentedJQuery, attrs:IFileUploadAttrs, ngModel:INgModelController) {
            scope.ctrl.ngModelController = ngModel;
            scope.ctrl.compile();
        }
    };
}
