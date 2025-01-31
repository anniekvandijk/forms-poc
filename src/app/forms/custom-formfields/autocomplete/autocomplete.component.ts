import { Component, computed, ElementRef, HostBinding, inject, Input, input, OnDestroy, OnInit, Optional, Self, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteFormGroup } from './autocompleteFormGroup.model';
import { Subject } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

///
// This is a custom autocomplete component that uses the MatFormFieldControl and ControlValueAccessor interfaces
// The MatFormFieldControl interface is needed for the MatFormField to work
// The ControlValueAccessor interface is needed for the formControl to work
// https://material.angular.io/guide/creating-a-custom-form-field-control#trying-it-out

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
    // This is not needed, because the ControlValueAccessor is already provided in the MatFormFieldControl
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   multi: true,
    //   useExisting: forwardRef(() => CustomAutocompleteComponent),
    // },
    {
      provide: MatFormFieldControl,
      useExisting: CustomAutocompleteComponent,
    }
  ],
})
export class CustomAutocompleteComponent implements ControlValueAccessor, OnInit, MatFormFieldControl<string>, OnDestroy {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  // placeholder = input('Selecteer een optie');
  options = input<string[]>([]);
  private readonly fb = inject(FormBuilder);
  private filterValue = signal<string>('');
  autocompleteForm!: FormGroup<AutocompleteFormGroup>;
  filteredOptions = computed(() => {
    const value = this.filterValue().toLowerCase();
    return this.options().filter(option => option.toLowerCase().includes(value));
  });

  /* MatFormFieldControl method */
  // For using both MatFormFieldControl and ControlValueAccessor, the following code is needed
  constructor(@Optional() @Self() public ngControl: NgControl) { 
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }
  /* MatFormFieldControl method */

  ngOnInit(): void {
    this.autocompleteForm = this.fb.nonNullable.group({
      autocomplete: ['']
    });
    if (this.required) {
      this.autocompleteForm.controls.autocomplete.setValidators(Validators.required);
    } else {
      this.autocompleteForm.controls.autocomplete.clearValidators();
    }
  }

  filter(): void {
    this.filterValue.set(this.input.nativeElement.value.toLowerCase());
  }

  optionSelected(optionSelected: MatAutocompleteSelectedEvent ) {
    this.onChange(optionSelected.option.value);
    this.markAsTouched();
  }
 
  /* MatFormFieldControl methods */

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(placeholder) {
    console.log('set placeholder', placeholder);
    this._placeholder = placeholder;
    this.stateChanges.next();
  }
  private _placeholder!: string;

  stateChanges = new Subject<void>();

  set value(autocomplete: string) {
    this.autocompleteForm.controls.autocomplete.setValue(autocomplete);
    this.stateChanges.next();
  }

  static nextId = 0;

  @HostBinding() id = `autocomplete-input-${CustomAutocompleteComponent.nextId++}`;   
  
  ngOnDestroy() {
    this.stateChanges.complete();
  }

  focused = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }
  
  onFocusOut(event: FocusEvent) {
    if (!this.input.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  get empty() {
    return !(this.autocompleteForm.value);
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required(): boolean { return this._required; }
  set required(req: BooleanInput) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    if (this.autocompleteForm) {
      if (this._disabled) {
        this.autocompleteForm.disable();
      } else {
        this.autocompleteForm.enable();
      }
      this.stateChanges.next();
    }
  }
  private _disabled = false;

  // If this does not work, change this like explained in
  // https://material.angular.io/guide/creating-a-custom-form-field-control#trying-it-out
  get errorState(): boolean {
    return this.autocompleteForm.invalid && this.touched;
  }

  controlType = 'custom-autocomplete-input';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy = '';

  // TODO: queryselector fix
  setDescribedByIds(ids: string[]) {
    const controlElement = this.input.nativeElement
      .querySelector('.example-tel-input-container')!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.input.nativeElement.querySelector('input')?.focus();
    }
  }

  /* ControlValueAccessor methods */

  // ControlValueAccessor method writeValue
  writeValue(value: string): void {
    if (this.autocompleteForm) {
      this.autocompleteForm.controls.autocomplete.setValue(value);
    }
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

  // TODO check this, both controlValueAccessor and matFormFieldControl have a disabled property
  //disabled!: boolean;
  
  // TODO fix disabled
  // setDisabledState?(isDisabled: boolean): void {
  //    this.disabled = isDisabled;
  //  }

}