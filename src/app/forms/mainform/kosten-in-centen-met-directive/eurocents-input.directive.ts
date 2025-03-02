/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-selector */

import { CurrencyPipe } from '@angular/common';
import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[eurocentsInputField]',
  standalone: true,
  providers: [CurrencyPipe, 
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EurocentsInputFieldDirective),
      multi: true,
    },
  ],
})
export class EurocentsInputFieldDirective implements ControlValueAccessor {
  private readonly currencyPipe = inject(CurrencyPipe);
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
    this.el.value = this.formatToCurrency(value);
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
    const cents = this.parseToCents(value);
      this.onChange(cents); // Store value in cents
      this.onTouched();
    // on blur, format value to currency. If value is empty, set to zero value.
    this.el.value = this.formatToCurrency(cents);
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
    console.log('input', this.el.value);
  }

  private parseToCents(value: string): number {
    const numericValue = value.replace(
      this.removeNonDigitsRegex,
      '',
    ).replace(',', '.');
    return Math.round(parseFloat(numericValue) * 100) || 0;
  }

  private formatToCurrency(value: number): string {
    return this.currencyPipe.transform(
      (value / 100).toFixed(2),
      'EUR',
    ) || '';
  }
}
