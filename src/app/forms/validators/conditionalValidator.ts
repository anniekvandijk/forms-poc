import { WritableSignal } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function conditionalValidator(shouldValidateSignal: WritableSignal<boolean>, validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!shouldValidateSignal()) {
      return null; 
    }
    for (const validator of validators) {
      const error = validator(control);
      if (error) {
        return error;
      }
    }

    return null;
  };
}