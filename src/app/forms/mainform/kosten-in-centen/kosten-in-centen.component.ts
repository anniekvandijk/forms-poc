import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CurrencyPipe } from '@angular/common';
import { delay } from 'rxjs';
import { FormService } from '../../form.service';
import { KostenForm } from './../kosten/kosten.model';
import { CurrencyCentsInputMaskDirective } from './currency-cents-input.directive';

@Component({
  selector: 'app-kosten-in-centen',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CurrencyCentsInputMaskDirective,
  ],
  templateUrl: './kosten-in-centen.component.html',
  styleUrls: ['./kosten-in-centen.component.scss'],
})
export class KostenInCentenComponent implements OnInit {
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
        alpacas: [244],
        honden: [523],
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
    const value = this.kostenForm.controls.huisdieren.controls.totaal.value;
    return value ? value/100 : 0;
  }

  get hobbiesTotaalValue() {
    const value = this.kostenForm.controls.hobbies.controls.totaal.value;
    return value ? value/100 : 0;
  }

  get etenTotaalValue() {
    const value = this.kostenForm.controls.eten.controls.totaal.value;
    return value ? value/100 : 0;
  }

  get totaalValue() {
    const value = this.kostenForm.controls.totaal.value;
    return value ? value/100 : 0;
  }

  private calculate(): void {
    // Huisdieren
    const alpacas = this.kostenForm.controls.huisdieren.controls.alpacas.value;
    console.log('alpacas', alpacas);
    const alpaca = parseInt(this.kostenForm.controls.huisdieren.controls.alpacas.value.toString()) || 0;
    console.log('alpaca', alpaca);
    const honden = this.kostenForm.controls.huisdieren.controls.honden.value;
    console.log('honden', honden);


    const totaalHuisdierenInCents = alpacas + honden;
    console.log('totaalHuisdierenInCents', totaalHuisdierenInCents);
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
}
