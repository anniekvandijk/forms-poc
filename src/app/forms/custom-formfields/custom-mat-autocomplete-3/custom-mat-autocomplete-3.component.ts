import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, computed, ElementRef, EventEmitter, HostBinding, inject, Input, input, OnDestroy, OnInit, Optional, Output, Self, signal, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormsModule, NgControl, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';

///
// This is a custom autocomplete component that uses the MatFormFieldControl and ControlValueAccessor interfaces
// The MatFormFieldControl interface is needed for the MatFormField to work
// The ControlValueAccessor interface is needed for the formControl to work
// https://material.angular.io/guide/creating-a-custom-form-field-control#trying-it-out

@Component({
  selector: 'app-custom-mat-autocomplete-3',
  templateUrl: 'custom-mat-autocomplete-3.component.html',
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
      useExisting: CustomMatAutocomplete3Component,
    }
  ],
})
export class CustomMatAutocomplete3Component implements ControlValueAccessor, Validator, MatFormFieldControl<string>, OnInit, OnDestroy {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  
  // This is to emit the formControl to the parent component
  @Output() formControlReady = new EventEmitter<FormControl>();
  options = input.required<string[]>();
  private readonly fb = inject(FormBuilder);
  private filterValue = signal<string>('');
  autocompleteFormControl = this.fb.control('');
  filteredOptions = computed(() => {
    return this.options()
      .filter(option => 
        option
        .toLowerCase()
        .includes(this.filterValue().toLowerCase())
      );
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

  // ngOnInit(): void {
  //   if (this.required) {
  //     this.autocompleteFormControl.setValidators(Validators.required);
  //   } else {
  //     this.autocompleteFormControl.clearValidators();
  //   }
  // }

  /* This is to emit the formControl to the parent component
  *  This is a method to get a formControl, formArray or FormGroup
  *  attached to the parent component form
  */
  ngOnInit(): void {
    this.formControlReady.emit(this.autocompleteFormControl);
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
  set placeholder(plh) {
   // console.log('set placeholder', plh);
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder!: string;

  stateChanges = new Subject<void>();

  set value(autocomplete: string) {
    this.autocompleteFormControl.setValue(autocomplete);
    this.stateChanges.next();
  }

  static nextId = 0;

  @HostBinding() id = `autocomplete-input-${CustomMatAutocomplete3Component.nextId++}`;   
  
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
    return !(this.autocompleteFormControl.value);
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() { return this.focused || !this.empty; }

  @Input()
  get required(): boolean { return this._required; }
  set required(req: BooleanInput) {
    this._required = coerceBooleanProperty(req);
    // if (this.autocompleteFormControl) {
    //   if (this._required) {
    //     this.autocompleteFormControl.setValidators(Validators.required);
    //   } else {
    //     this.autocompleteFormControl.removeValidators(Validators.required);
    //   }
    this.stateChanges.next();
  }
  private _required = false;

  // If this does not work, change this like explained in
  // https://material.angular.io/guide/creating-a-custom-form-field-control#trying-it-out
  get errorState(): boolean {
    return this.autocompleteFormControl.invalid && this.touched;
  }

  controlType = 'custom-autocomplete-input';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy! : string;

  // TODO: setDescribedByIds check if this is ok
  setDescribedByIds(ids: string[]) {
    const controlElement = this.input && this.input.nativeElement && this.input.nativeElement
      .querySelector('.custom-autocomplete-input-container')!;
  //  console.log('controlElement', controlElement);
  //  console.log('ids', ids);
  //  controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.input.nativeElement.querySelector('input')?.focus();
    }
  }

  /* ControlValueAccessor methods */

  // ControlValueAccessor method writeValue
  writeValue(value: string): void {
    if (this.autocompleteFormControl) {
      this.autocompleteFormControl.setValue(value);
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

  
  //* ControlValueAccessor 
  // Sets the disabled state of the control linked to the form
  // in this component
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  ///* MatFormFieldControl
  // Sets the disabled state of the control
  // in this component
  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    if (this.autocompleteFormControl) {
      if (this._disabled) {
        this.autocompleteFormControl.disable();
      } else {
        this.autocompleteFormControl.enable();
      }
      this.stateChanges.next();
    }
  }
  private _disabled = false;

  validate(c: AbstractControl): ValidationErrors | null {
    console.log('validate kleur4', c);
    const validationErrors = this.autocompleteFormControl.invalid 
      ? { internal: true} 
      : null;
    return validationErrors;
  }


}