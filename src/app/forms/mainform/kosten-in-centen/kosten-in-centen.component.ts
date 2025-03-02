import { Component, DEFAULT_CURRENCY_CODE, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CurrencyPipe } from '@angular/common';
import { delay } from 'rxjs';
import { FormService } from '../../form.service';
import { KostenForm } from './../kosten/kosten.model';

@Component({
  selector: 'app-kosten-in-centen',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  providers: [CurrencyPipe],
  templateUrl: './kosten-in-centen.component.html',
  styleUrls: ['./kosten-in-centen.component.scss'],
})
export class KostenInCentenComponent implements OnInit {
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  private readonly currencyPipe = inject(CurrencyPipe);
    private readonly currencyCode = inject(DEFAULT_CURRENCY_CODE);
  mainform = this.formService.formSignal();
  kostenForm!: FormGroup<KostenForm>;

  ngOnInit(): void {
    this.createForm();
    this.formService.addChildFormGroup('kosten2', this.kostenForm);
    this.calculate();
    this.kostenForm.valueChanges.pipe(delay(400)).subscribe(() => {
      this.calculate();
    });
  }

  createForm(): void {
    this.kostenForm = this.formbuilder.nonNullable.group({
      huisdieren: this.formbuilder.nonNullable.group({
        alpacas: [244],
        honden: [523],
        totaal: [767],
      }),
      hobbies: this.formbuilder.nonNullable.group({
        knutselen: [0],
        gamen: [0],
        totaal: [0],
      }),
      eten: this.formbuilder.nonNullable.group({
        boodschappen: [0],
        uiteten: [0],
        totaal: [0],
      }),
      totaal: [0],
    });
  }

  get alpacas() {
    return this.transformToCurrency(this.kostenForm.controls.huisdieren.controls.alpacas.value);
  }
  onAlpacasChange(event: Event) {
    this.setValueFromEvent(event, this.kostenForm.controls.huisdieren.controls.alpacas);
  }

  get honden() {  
    return this.transformToCurrency(this.kostenForm.controls.huisdieren.controls.honden.value);
  } 

  onHondenChange(event: Event) {
    this.setValueFromEvent(event, this.kostenForm.controls.huisdieren.controls.honden);
  }

  get knutselen() {
    return this.transformToCurrency(this.kostenForm.controls.hobbies.controls.knutselen.value);
  }

  onKnutselenChange(event: Event) {
    this.setValueFromEvent(event, this.kostenForm.controls.hobbies.controls.knutselen);
  }

  get gamen() {
    return this.transformToCurrency(this.kostenForm.controls.hobbies.controls.gamen.value);
  }

  onGamenChange(event: Event) {
    this.setValueFromEvent(event, this.kostenForm.controls.hobbies.controls.gamen);
  }

  get boodschappen() {
    return this.transformToCurrency(this.kostenForm.controls.eten.controls.boodschappen.value);
  }

  onBoodschappenChange(event: Event) {
    this.setValueFromEvent(event, this.kostenForm.controls.eten.controls.boodschappen);
  }

  get uiteten() {
    return this.transformToCurrency(this.kostenForm.controls.eten.controls.uiteten.value);
  }

  onUitetenChange(event: Event) {
    this.setValueFromEvent(event, this.kostenForm.controls.eten.controls.uiteten);
  }

  get totaalHuisdieren() {
    return this.transformToCurrency(this.kostenForm.controls.huisdieren.controls.totaal.value);
  }

  get totaalHobbies() {
    return this.transformToCurrency(this.kostenForm.controls.hobbies.controls.totaal.value);
  }

  get totaalEten() {
    return this.transformToCurrency(this.kostenForm.controls.eten.controls.totaal.value);
  }

  get totaal() {
    return this.transformToCurrency(this.kostenForm.controls.totaal.value);
  }

  private calculate(): void {
    // Huisdieren
    const alpacas = this.kostenForm.controls.huisdieren.controls.alpacas.value;
    const honden = this.kostenForm.controls.huisdieren.controls.honden.value;
    const totaalHuisdierenInCents = alpacas + honden;
    this.kostenForm.controls.huisdieren.controls.totaal.setValue(
      totaalHuisdierenInCents,
      { emitEvent: false },
    );

    // Hobbies
    const knutselen = this.kostenForm.controls.hobbies.controls.knutselen.value;
    const gamen = this.kostenForm.controls.hobbies.controls.gamen.value;

    const totaalHobbiesInCents = knutselen + gamen;
    this.kostenForm.controls.hobbies.controls.totaal.setValue(
      totaalHobbiesInCents,
      { emitEvent: false },
    );

    // Eten
    const boodschappen = this.kostenForm.controls.eten.controls.boodschappen.value;
    const uiteten = this.kostenForm.controls.eten.controls.uiteten.value;

    const totaalEtenInCents = boodschappen + uiteten;
    this.kostenForm.controls.eten.controls.totaal.setValue(
      totaalEtenInCents,
      { emitEvent: false },
    );

    // Totaal
    const totaal =
      totaalHuisdierenInCents + totaalHobbiesInCents + totaalEtenInCents;
    this.kostenForm.controls.totaal.setValue(totaal, {
      emitEvent: false,
    });
  }

  private transformToCurrency(value: number): string {
    return this.currencyPipe.transform(
      (value/100).toFixed(2),
      this.currencyCode,
    ) || '';
  }

  private transformToCents(event: Event): number {
    const value = (event.target as HTMLInputElement).value;
    const numericValue = Math.round(
      (parseFloat(value.replace(',', '.').replace(new RegExp(`[^0-9\\.]+`, 'g'), ''))
      )*100
    ) || 0;
    return numericValue;
  }

  private setValueFromEvent(event: Event, control: FormControl): void {
   control.setValue(
      this.transformToCents(event),
      { emitEvent: false },
    );
  }
}
