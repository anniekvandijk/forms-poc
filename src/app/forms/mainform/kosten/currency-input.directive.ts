/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-selector */

import { CurrencyPipe } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, Directive, ElementRef, HostListener, inject, LOCALE_ID, OnInit } from "@angular/core";

@Directive({ selector: "[currencyInput]",
  standalone: true,
  providers: [CurrencyPipe]
 })
export class CurrencyInputMaskDirective implements OnInit {
  private readonly localeId = inject(LOCALE_ID);
  private readonly currencyCode = inject(DEFAULT_CURRENCY_CODE);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly elementRef = inject(ElementRef);
  private decimalSeparator = this.localeId === 'nl-NL' ? ',' : '.';
  private el = this.elementRef.nativeElement;
  private digitRegex = new RegExp(
    `^(\\d+(\\${this.decimalSeparator}\\d{0,2})?|\\${this.decimalSeparator}\\d{0,2})$`,
    'g'
  )
  private lastValidInput = `0${this.decimalSeparator}00`;
  

  ngOnInit() {
    // set initial value and format it to currency
    this.el.value = this.currencyPipe
      .transform(this.el.value.replace(this.decimalSeparator, '.'), this.currencyCode) || '';
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value: any) {
    // on focus remove currency formatting
    this.el.value = value.replace(new RegExp(`[^0-9\\${this.decimalSeparator}]+`, 'g'), '')
    this.el.select();
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value: any) {
    // on blur, format value to currency. If value is empty, set to zero value.
    if (!value) value = `0${this.decimalSeparator}00`;	
    this.el.value = this.currencyPipe
      .transform(value.replace(this.decimalSeparator, '.'), this.currencyCode) || '';
  }

  @HostListener("keydown.control.z", ["$event.target.value"])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUndo(_value: any) {
    // on undo, format value to zero value
    this.el.value = `0${this.decimalSeparator}00`;
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    // on input, run regex to only allow certain characters and format
    const cleanValue = (event.target.value.match(this.digitRegex) || []).join('')
    if (cleanValue || !event.target.value)
      this.lastValidInput = cleanValue
    this.el.value = cleanValue || this.lastValidInput
  }
}