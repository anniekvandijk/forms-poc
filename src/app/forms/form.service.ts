import { inject, Injectable, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class FormService {
  private readonly formbuilder = inject(FormBuilder);
  formSignal = signal<FormGroup>(this.formbuilder.group({}));

  fb(): FormBuilder {
    return this.formbuilder;
  }

  addChildFormGroup(name: string, group: FormGroup) {
    this.formSignal.update((form: FormGroup) => {
      form.addControl(name, group);
      return form;
    });
  }

  addChildFormArray(name: string, array: FormArray) {
    this.formSignal.update((form: FormGroup) => {
      form.addControl(name, array);
      return form;
    });
  }
  addChildFormControl(name: string, formControl: FormControl) {
    this.formSignal.update((form: FormGroup) => {
      form.addControl(name, formControl);
      return form;
    });
  }

  addChildFormControls(formControls: { name: string, formControl: FormControl }[]) {
    formControls.forEach(item => {
      this.formSignal.update((form: FormGroup) => {
        form.addControl(item.name, item.formControl);
        return form;
      });
    });
  }

  private markAllAsTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
  
  private getInvalidControls(formGroup: FormGroup): string[] {
    const invalidControls: string[] = [];

    const recursiveCheck = (form: FormGroup | FormArray, path = '') => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        const controlPath = path ? `${path}.${field}` : field;

        if (control instanceof FormGroup || control instanceof FormArray) {
          recursiveCheck(control, controlPath);
        } else if (control && control.invalid) {
          invalidControls.push(controlPath);
        }
      });
    };

    recursiveCheck(formGroup);
    return invalidControls;
  }

  submitForm() {
    this.markAllAsTouched(this.formSignal());
    console.log('form: ', this.formSignal());
    console.log('form values: ', this.formSignal().getRawValue());
    if (this.formSignal().valid) {
      console.log('Form is valid');
    } else {
      console.log('Form is invalid');
      const invalidFields = this.getInvalidControls(this.formSignal());
      if (invalidFields.length > 0) {
        console.log('Invalid fields:', invalidFields);
      }
    }
  }
}
