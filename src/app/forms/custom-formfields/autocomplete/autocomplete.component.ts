import {Component, computed, ElementRef, forwardRef, input, signal, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
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

  // ControlValueAccessor methods

  /* 
  * This method is called when the form control is instantiated.
  * It is used to write the initial value to the view.
  * @param value The initial value to write to the view.
  */
  writeValue(value: string): void {
    // TODO check if value is in options
    this.autocompleteControl.setValue(value);
  }

  private touched = false;
  onTouched: any = () => {};
  registerOnTouched(onTouched: any): void {
      this.onTouched = onTouched;
  }

  private markAsTouched(): void{
    if(!this.touched){
      this.touched = true;
      this.onTouched();
    }
  }

  onChange = (input: string) => {};

  registerOnChange(onChange: any): void {
      this.onChange = onChange;
  }

  valueChanged(value: string) {
    this.onChange(value);
    this.markAsTouched();
  }

  disabled!: boolean;
    
  setDisabledState?(isDisabled: boolean): void {
     this.disabled = isDisabled;
   }

}