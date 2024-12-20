import {Component, computed, ElementRef, forwardRef, input, signal, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-autocomplete',
  templateUrl: 'autocomplete.component.html',
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
      useExisting: forwardRef(() => CustomAutocompleteComponent),
    },
  ],
})
export class CustomAutocompleteComponent implements ControlValueAccessor {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  placeholder = input('Selecteer een optie');
  options = input<string[]>([]);
  private filterValue = signal<string>('');
  autocompleteControl = new FormControl('');
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
    this.autocompleteControl.setValue(value);
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
  onChange = (input: string) => {
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