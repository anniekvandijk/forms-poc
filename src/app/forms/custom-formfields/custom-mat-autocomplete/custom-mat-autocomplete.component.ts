import { Component, computed, ElementRef, forwardRef, inject, input, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
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
      useExisting: forwardRef(() => CustomMatAutocompleteComponent),
    },
    {
      provide: MatFormFieldControl,
      useExisting: CustomMatAutocompleteComponent,
    }
  ],
  styles: [`
    .form-field {
      width: 100%;
    }
  `]
})
export class CustomMatAutocompleteComponent implements ControlValueAccessor {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  label = input<string>('Selecteer een optie');
  options = input<string[]>([]);
  private readonly fb = inject(FormBuilder);
  private filterValue = signal<string>('');
  autocompleteFormControl = new FormControl<string>('');
  filteredOptions = computed(() => {
    const value = this.filterValue().toLowerCase();
    return this.options().filter(option => option.toLowerCase().includes(value));
  });
  filter(): void {
    this.filterValue.set(this.input.nativeElement.value.toLowerCase());
  }

  optionSelected(optionSelected: MatAutocompleteSelectedEvent ) {
    this.onChange(optionSelected.option.value);
    this.markAsTouched();
  }
   
  /* ControlValueAccessor methods */

  // ControlValueAccessor method writeValue
  writeValue(value: string): void {
    this.autocompleteFormControl.setValue(value);
  }

  // ControlValueAccessor method registerOnTouched
  private touched = false;
  onTouched: any = () => {
    // empty function
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

  // ControlValueAccessor method registerOnChange

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_input: string) => {
    // empty function in order to avoid errors
  };

  registerOnChange(onChange: any): void {
      this.onChange = onChange;
  }

  // ControlValueAccessor method setDisabledState

  disabled!: boolean;
  
  // TODO fix disabled
  setDisabledState?(isDisabled: boolean): void {
     this.disabled = isDisabled;
   }

}