import {IFormController} from "angular";
import {IValidationErrors} from "vesta-schema/Validator";

export class FormService {
    private static instance:FormService = null;
    static $inject = [];

    constructor() {
        FormService.instance = this;
    }

    public evaluate(validationErrors:IValidationErrors, form:IFormController):boolean {
        form.$setPristine();
        if (validationErrors == null) return true;
        for (let fieldNames = Object.keys(validationErrors), i = 0, il = fieldNames.length; i < il; ++i) {
            let fieldName = fieldNames[i];
            if (!form[fieldName]) {
                console.log(`${fieldName} does not exist on formController. You might forget to use name attribute on your form element`);
                continue;
            }
                form[fieldName].$setValidity(validationErrors[fieldName].rule, false);
                form[fieldName].$setDirty();
            }
        return false;
    }

    public static getInstance():FormService {
        return FormService.instance;
    }
}
