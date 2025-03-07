/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-selector */

import { PercentPipe } from '@angular/common';
import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[percentageInputField]',
  standalone: true,
  providers: [PercentPipe, 
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PercentageInputFieldDirective),
      multi: true,
    },
  ],
})
export class PercentageInputFieldDirective implements ControlValueAccessor {
  private readonly percentPipe = inject(PercentPipe);
  private readonly elementRef = inject(ElementRef);
  private el: HTMLInputElement = this.elementRef.nativeElement;
  private digitRegex = new RegExp(
    `^(\\d+(\\,\\d{0,2})?|\\,\\d{0,2})$`,
    'g',
  );
  private removeNonDigitsRegex = new RegExp(
    `[^0-9\\,]+`,
    'g'
  );
  private lastValidInput = '0';

  /* ContolValueAccessor implementation */
  private onChange: (value: number) => void = () => { /* no actions needed */ };
  private onTouched: () => void = () => { /* no actions needed */ };
  writeValue(value: number): void {
    this.el.value = this.formatToPercentage(value);
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  /* End of ControlValueAccessor implementation */

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: any) {
    // on focus remove currency formatting
    this.el.value = value.replace(
      this.removeNonDigitsRegex,
      '',
    );
    this.el.select();
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: any) {
    // on blur, format value to currency. If value is empty, set to zero value.
    if (!value) value = `0,00`;
    const hundereds = this.parseToHunderds(value);
      this.onChange(hundereds); // Store value in cents
      this.onTouched();
    // on blur, format value to currency. If value is empty, set to zero value.
    this.el.value = this.formatToPercentage(hundereds);
  }

  @HostListener('keydown.control.z', ['$event.target.value'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUndo(_value: any) {
    // on undo, format value to zero value
    this.el.value = '0';
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    // on input, run regex to only allow certain characters and format
    const cleanValue = (event.target.value.match(this.digitRegex) || []).join(
      '',
    );
    if (cleanValue || !event.target.value) this.lastValidInput = cleanValue;
    this.el.value = cleanValue || this.lastValidInput;
  }

  private parseToHunderds(value: string): number {
    const numericValue = value.replace(
      this.removeNonDigitsRegex,
      '',
    )
    .replace(',', '.');
    return (parseFloat(numericValue)/1000) || 0;
  }

  private formatToPercentage(value: number): string {
    return this.percentPipe.transform(
      (value),
      '1.2-2'
    ) || '';
  }
}
