import { Injectable } from "@nestjs/common";
import { buildMessage, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'IsInNested', async: true })
@Injectable()
export class IsInNestedRule implements ValidatorConstraintInterface {
    constructor() { }

    async validate(value: any, args: ValidationArguments) {
        try {
            let flag = true;
            let possibleValues = args.constraints[0]
            if (Array.isArray(possibleValues)) {
                Object.keys(value).forEach((key: string) => {
                    !possibleValues.some(possibleValue => possibleValue === value[key]) ? flag = false : null;
                })
            } else {
                flag = false;
            }
            return flag;
        } catch (e) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return '$property\'s all property must have one of the following values: $constraint1';
    }
}

export function IsInNested(value?: readonly any[], validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsInNested',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [value],
            options: validationOptions,
            validator: IsInNestedRule
        });
    };
}