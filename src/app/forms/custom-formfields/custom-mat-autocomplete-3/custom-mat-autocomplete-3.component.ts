/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, computed, ElementRef, EventEmitter, forwardRef, HostBinding, inject, Injector, Input, input, OnDestroy, OnInit, Optional, Output, Self, signal, ViewChild, DoCheck } from '@angular/core';
import { AbstractControl, AbstractControlDirective, ControlValueAccessor, FormBuilder, FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
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
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomMatAutocomplete3Component),
    },
    {
      provide: MatFormFieldControl,
      useExisting: CustomMatAutocomplete3Component,
    }
  ],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class CustomMatAutocomplete3Component implements ControlValueAccessor,MatFormFieldControl<any>, OnInit, DoCheck, OnDestroy {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  options = input.required<string[]>();
  private readonly fb = inject(FormBuilder);
  private readonly injector = inject(Injector);
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

  filter(): void {
    const value = this.input.nativeElement.value.toLowerCase();
    this.filterValue.set(value);
    this.onChange(value);
    this.stateChanges.next();
  }

  optionSelected(optionSelected: MatAutocompleteSelectedEvent ) {
    this.onChange(optionSelected.option.value);
    this.markAsTouched();
    this.stateChanges.next();
  }

  ngControl: NgControl | null = null;
  
  ngOnInit(): void {
    this.ngControl  = this.injector.get(NgControl);
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; 
    }
  }

  /* MatFormFieldControl methods */
  stateChanges = new Subject<void>();

  set value(value: string) {
    // Not used, but needed for the interface
    // this.control.setValue(value);
    // this.onChange(value);
    // this.stateChanges.next();
  }

  get empty() {
    return !(this.autocompleteFormControl.value);
  }

  /* ---- Name and Id stuff for MatFormFieldControl ---- */
  controlType = 'custom-autocomplete-input';
  static nextId = 0;
  @HostBinding() id = `autocomplete-input-${CustomMatAutocomplete3Component.nextId++}`;   
  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
  /* ---- Name and Id stuff for MatFormFieldControl ---- */

  /* ---- Floating label for MatFormFieldControl ---- */
  @HostBinding('class.floating')
  get shouldLabelFloat() { return this.focused || !this.empty; }
  /* ---- Floating label for MatFormFieldControl ---- */

  /* ---- ErrorStateMatcher for MatFormFieldControl ---- */
  errorState = false;

  ngDoCheck(): void {
    if(this.ngControl) {
       this.errorState = !!this.ngControl?.invalid && !!this.ngControl?.touched;
      this.stateChanges.next();
    }
 }

  /* ---- Focussed for MatFormFieldControl ---- */
  focused = false;

  onContainerClick(event: MouseEvent) {
    console.log('container click', event);
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.input.nativeElement.querySelector('input')?.focus();
    }
    this.touched = true;
    this.focused = true;
    this.stateChanges.next();
  }

  onFocusIn(event: FocusEvent) {
    console.log('focus in', event);	
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }
  
  onFocusOut(event: FocusEvent) {
    console.log('focus out', event);
    if (!this.input.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }
  /* ---- Focussed for MatFormFieldControl ---- */

  /* ---- Placeholder for MatFormFieldControl ---- */
  private _placeholder!: string;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  /* ---- Placeholder for MatFormFieldControl ---- */

  /* ---- Disabled for MatFormFieldControl ---- */ 
  private _disabled = false;

  @Input()
  get disabled(): boolean { 
    return this.ngControl?.control?.disabled
    ? this._disabled = true
    : this._disabled = false;
  }

  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    // this is needed to disable the autocomplete input
    if (this.autocompleteFormControl) {
      if (this._disabled) {
        this.autocompleteFormControl.disable();
      } else {
        this.autocompleteFormControl.enable();
      }
      this.stateChanges.next();
    }
  }
  /* ---- Disabled for MatFormFieldControl ---- */

  /* ---- Required for MatFormFieldControl ---- */
  // private _required = false;

  @Input()
  get required(): boolean { 
    return this.ngControl?.control?.hasValidator(Validators.required) 
    ? true 
    : false;
  }

  set required(req: BooleanInput) {
    // Not used, but needed for the interface
    // for template driven forms
  }
  /* ---- Required for MatFormFieldControl ---- */

  /* ControlValueAccessor methods */

  writeValue(value: string): void {
    this.ngControl?.control?.setValue(value);
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

  onChange = (_input: string) => {};

  registerOnChange(onChange: any): void {
      this.onChange = onChange;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /* --- ControlValueAccessor --- */

  /* ---- Complete stateChanges ---- */
  ngOnDestroy() {
    this.stateChanges.complete();
  }
}