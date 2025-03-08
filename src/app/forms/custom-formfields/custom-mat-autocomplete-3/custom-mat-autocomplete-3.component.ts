/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, computed, ElementRef, forwardRef, HostBinding, inject, Injector, Input, input, OnDestroy, OnInit, signal, ViewChild, DoCheck } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-custom-mat-autocomplete-3',
  templateUrl: 'custom-mat-autocomplete-3.component.html',
  styleUrl: 'custom-mat-autocomplete-3.component.scss',
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
    this.onFocus();
    this.stateChanges.next();
  }

  optionSelected(optionSelected: MatAutocompleteSelectedEvent ) {
    this.onChange(optionSelected.option.value);
    this.onTouched();
    this.stateChanges.next();
  }

  ngControl: NgControl | null = null;
  

  /* --- combine the MatFormFieldControl and ControlValueAccessor --- */

  ngOnInit(): void {
    this.ngControl  = this.injector.get(NgControl);
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; 
    }
  }

  /* ---- end combine the MatFormFieldControl and ControlValueAccessor ---- */

  /* MatFormFieldControl methods */

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.input.nativeElement.querySelector('input')?.focus();
    }
  }

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

  /* ---- Floating label for MatFormFieldControl ---- */
  @HostBinding('class.floating')
  get shouldLabelFloat() { return this.focused || !this.empty; }

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

  onFocus() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }
  
  onBlur(event: FocusEvent) {
    if (!this.input.nativeElement.contains(event.relatedTarget as Element)) {
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

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

  /* ---- Required for MatFormFieldControl ---- */

  // required for template driven forms
  // _required = false;

  // @Input()
  // get required(): boolean { 
  //   return this._required;
  // }
  
  set required(req: BooleanInput) {
    // this._required = coerceBooleanProperty(req);
    // this.stateChanges.next();
  }

  // required for reactive forms
  get required(): boolean { 
    return this.ngControl?.control?.hasValidator(Validators.required) 
    ? true 
    : false;
  }



  /* ControlValueAccessor methods */

  writeValue(value: string): void {
    this.ngControl?.control?.setValue(value);
  }

  touched = false;
  
  onTouched = () => {
    this.touched = true;
  };

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  onChange = (_input: string) => {};

  registerOnChange(onChange: any): void {
      this.onChange = onChange;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /* --- ControlValueAccessor --- */

  /* ---- Complete stateChanges MatFormFieldControl ---- */
  ngOnDestroy() {
    this.stateChanges.complete();
  }
}