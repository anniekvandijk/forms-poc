import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CurrencyPipe } from '@angular/common';
import { delay } from 'rxjs';
import { FormService } from '../../form.service';
import { CurrencyInputMaskDirective } from './currency-input.directive';
import { KostenForm } from './kosten.model';

@Component({
  selector: 'app-kosten',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CurrencyInputMaskDirective,
  ],
  templateUrl: './kosten.component.html',
  styleUrls: ['./kosten.component.scss'],
})
export class KostenComponent implements OnInit {
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  kostenForm!: FormGroup<KostenForm>;

  ngOnInit(): void {
    this.createForm();
    this.formService.addChildFormGroup('kosten', this.kostenForm);
    this.calculate();
    this.kostenForm.valueChanges.pipe(delay(400)).subscribe(() => {
      this.calculate();
    });
  }

  createForm(): void {
    this.kostenForm = this.formbuilder.nonNullable.group({
      huisdieren: this.formbuilder.nonNullable.group({
        alpacas: [2.44],
        honden: [5.23],
        totaal: [0],
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

  get huisdierenTotaalValue() {
    return this.kostenForm.controls.huisdieren.controls.totaal.value ?? 0;
  }

  get hobbiesTotaalValue() {
    return this.kostenForm.controls.hobbies.controls.totaal.value ?? 0;
  }

  get etenTotaalValue() {
    return this.kostenForm.controls.eten.controls.totaal.value ?? 0;
  }

  get totaalValue() {
    return this.kostenForm.controls.totaal.value ?? 0;
  }

  private toFloatParser(value: number | string): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    return parseFloat(value.replace(',', '.'));
  }

  private toCentsParser(value: any): number {
    return value ? Math.round(this.toFloatParser(value) * 100) : 0;
  }

  private fromCentsParcer(value: number): number {
    return value ? value / 100 : 0;
  }

  private calculate(): void {
    // Huisdieren
    const alpacas =
      this.toCentsParser(
        this.kostenForm.controls.huisdieren.controls.alpacas.value,
      ) ?? 0;
    const honden =
      this.toCentsParser(
        this.kostenForm.controls.huisdieren.controls.honden.value,
      ) ?? 0;


    const totaalHuisdierenInCents = alpacas + honden;
    this.kostenForm.controls.huisdieren.controls.totaal.setValue(
      this.fromCentsParcer(totaalHuisdierenInCents),
      { emitEvent: false },
    );

    // Hobbies
    const knutselen =
      this.toCentsParser(
        this.kostenForm.controls.hobbies.controls.knutselen.value,
      ) ?? 0;
    const gamen =
      this.toCentsParser(
        this.kostenForm.controls.hobbies.controls.gamen.value,
      ) ?? 0;

    const totaalHobbiesInCents = knutselen + gamen;
    this.kostenForm.controls.hobbies.controls.totaal.setValue(
      this.fromCentsParcer(totaalHobbiesInCents),
      { emitEvent: false },
    );

    // Eten
    const boodschappen =
      this.toCentsParser(
        this.kostenForm.controls.eten.controls.boodschappen.value,
      ) ?? 0;
    const uiteten =
      this.toCentsParser(
        this.kostenForm.controls.eten.controls.uiteten.value,
      ) ?? 0;

    const totaalEtenInCents = boodschappen + uiteten;
    this.kostenForm.controls.eten.controls.totaal.setValue(
      this.fromCentsParcer(totaalEtenInCents),
      { emitEvent: false },
    );

    // Totaal

    if (
      isNaN(totaalHuisdierenInCents) ||
      isNaN(totaalHobbiesInCents) ||
      isNaN(totaalEtenInCents)
    ) {
      return;
    }

    const totaal =
      totaalHuisdierenInCents + totaalHobbiesInCents + totaalEtenInCents;
    this.kostenForm.controls.totaal.setValue(this.fromCentsParcer(totaal), {
      emitEvent: false,
    });
  }
}
