/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, computed, ElementRef, forwardRef, inject, input, signal, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

///
// This is a custom autocomplete component that uses the MatFormFieldControl and ControlValueAccessor interfaces
// The MatFormFieldControl interface is needed for the MatFormField to work
// The ControlValueAccessor interface is needed for the formControl to work
// https://material.angular.io/guide/creating-a-custom-form-field-control#trying-it-out

@Component({
  selector: 'app-custom-mat-autocomplete',
  templateUrl: 'custom-mat-autocomplete.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomMatAutocompleteComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => CustomMatAutocompleteComponent)
    }
  ],
  styles: [`
    .form-field {
      width: 100%;
    }
  `]
})
export class CustomMatAutocompleteComponent implements ControlValueAccessor, Validator {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  label = input<string>('Selecteer een optie');
  placeholder = input<string>('');
  options = input<string[]>([]);
  private readonly fb = inject(FormBuilder);
  private filterValue = signal<string>('');
  autocompleteFormControl = new FormControl<string>('');
  filteredOptions = computed(() => {
    const value = this.filterValue().toLowerCase();
    return this.options().filter(option => option.toLowerCase().includes(value));
  });
  filter(): void {
    const value = this.input.nativeElement.value.toLowerCase();
    this.filterValue.set(value);
    this.onChange(value);
  }

  onOptionSelected(optionSelected: MatAutocompleteSelectedEvent ) {
    this.onChange(optionSelected.option.value);
    this.markAsTouched();
  }
   
  /* ControlValueAccessor methods */

  writeValue(value: string): void {
   // console.log('writeValue', value);
    this.autocompleteFormControl.setValue(value);
  }

  touched = false;
  onTouched = () => {
  //  console.log('onTouched');
  };

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  private markAsTouched(): void{
    if(!this.touched){
      this.touched = true;
      this.onTouched();
    }
  }

  onChange = (autocompleteFormControl: string) => {
   // console.log('onChange');
  };

  registerOnChange(onChange: any): void {
      this.onChange = onChange;
  }

  disabled = false;
  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.autocompleteFormControl.disable();
    } else {
      this.autocompleteFormControl.enable();
    }
    this.disabled = disabled;
  }

  validate(c: AbstractControl): ValidationErrors | null {
  //  console.log('validate kleur2', c);
    const validationErrors = this.autocompleteFormControl.invalid 
      ? { internal: true} 
      : null;
    return validationErrors;
  }
}