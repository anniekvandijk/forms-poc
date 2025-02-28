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
    CurrencyInputMaskDirective
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
    this.kostenForm.valueChanges
      .pipe(delay(400))
      .subscribe(() => {
        this.calculate();
    });
  }

  createForm(): void {
    this.kostenForm = this.formbuilder.nonNullable.group({
      huisdieren: this.formbuilder.nonNullable.group({
        alpacas: [0.00],
        honden: [0.00],
        totaal: [0.00]
      }),
      hobbies: this.formbuilder.nonNullable.group({
        knutselen: [0.00],
        gamen: [0.00],
        totaal: [0.00]
      }),
      eten: this.formbuilder.nonNullable.group({
        boodschappen: [0.00],
        uiteten: [0.00],
        totaal: [0.00]
      }),
      totaal: [0.00]
    });
  }

  get huisdierenTotaalValue() {
    return this.kostenForm.controls.huisdieren.controls.totaal.value ?? 0.00;
  }

  get hobbiesTotaalValue() {
    return this.kostenForm.controls.hobbies.controls.totaal.value ?? 0.00;
  }

  get etenTotaalValue() {
    return this.kostenForm.controls.eten.controls.totaal.value ?? 0.00;
  }

  get totaalValue() {
    return this.kostenForm.controls.totaal.value ?? 0.00;
  }

  calculate(): void {
    // Huisdieren
    const alpacas = this.kostenForm.controls.huisdieren.controls.alpacas.value ?? 0.00;
    const honden = this.kostenForm.controls.huisdieren.controls.honden.value ?? 0.00;
    console.log('alpacas', alpacas);
    console.log('honden', honden);
    const totaalHuisdieren = alpacas + honden;
    this.kostenForm.controls.huisdieren.controls.totaal.setValue(totaalHuisdieren, { emitEvent: false });
    console.log('totaalhuisdieren', totaalHuisdieren);
    console.log('totaalhuisdierenformvalue', this.kostenForm.controls.huisdieren.controls.totaal.value);

    // Hobbies
    const knutselen = this.kostenForm.controls.hobbies.controls.knutselen.value ?? 0.00;
    const gamen = this.kostenForm.controls.hobbies.controls.gamen.value ?? 0.00;
    const totaalHobbies = knutselen + gamen;
    this.kostenForm.controls.hobbies.controls.totaal.setValue(totaalHobbies, { emitEvent: false });

    // Eten
    const boodschappen = this.kostenForm.controls.eten.controls.boodschappen.value ?? 0.00;
    const uiteten = this.kostenForm.controls.eten.controls.uiteten.value ?? 0.00;
    const totaalEten = boodschappen + uiteten;
    this.kostenForm.controls.eten.controls.totaal.setValue(totaalEten, { emitEvent: false });

    // Totaal
    const totaal = totaalHuisdieren + totaalHobbies + totaalEten;
    this.kostenForm.controls.totaal.setValue(totaal, { emitEvent: false });
    console.log('totaal', totaal);
    console.log('totaalformvalue', this.kostenForm.controls.totaal.value);
  }
}
