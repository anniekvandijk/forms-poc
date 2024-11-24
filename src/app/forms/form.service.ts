import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

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

  submitForm() {
    console.log('form: ', this.formSignal());
    console.log('form values: ', this.formSignal().getRawValue());
  }
}
