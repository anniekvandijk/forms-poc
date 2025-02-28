
import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";

@Directive({ selector: "[appCurrencyInputMask]",
  standalone: true,
  providers: [CurrencyPipe]
 })
export class CurrencyInputMaskDirective implements OnInit {

  private decimalSeparator = ','; // change this to '.' for other locales

  // build the regex based on max pre decimal digits allowed
  private regexString(max?: number) {
    const maxStr = max ? `{0,${max}}` : `+`;
    return `^(\\d${maxStr}(\\${this.decimalSeparator}\\d{0,2})?|\\${this.decimalSeparator}\\d{0,2})$`
  }
  private digitRegex!: RegExp;
  private setRegex(maxDigits?: number) {
    this.digitRegex = new RegExp(this.regexString(maxDigits), 'g')
  }
  @Input()
  set maxDigits(maxDigits: number) {
    this.setRegex(maxDigits);
  } 

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
    this.setRegex();
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.transform(this.el.value.replace(this.decimalSeparator, '.'), 'EUR') || '';
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value: any) {
    // on focus remove currency formatting
    this.el.value = value.replace(/[^0-9,]+/g, '')
    this.el.select();
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value: any) {
    // on blur, add currency formatting
    this.el.value = this.currencyPipe.transform(value.replace(this.decimalSeparator, '.'), 'EUR') || '';
  }

  @HostListener("keydown.control.z", ["$event.target.value"])
  onUndo(value: any) {
    this.el.value = '0,00';
  }

  // variable to store last valid input
  private lastValid = '0,00';
  @HostListener('input', ['$event'])
  onInput(event: any) {
    // on input, run regex to only allow certain characters and format
    const cleanValue = (event.target.value.match(this.digitRegex) || []).join('')
    if (cleanValue || !event.target.value)
      this.lastValid = cleanValue
    this.el.value = cleanValue || this.lastValid
  }
}