import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';

import { FormService } from '../../form.service';
import { BEZORGLOCATIES_DATA } from './bezorglocaties-data';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-bezorglocaties',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatRadioModule,
        CommonModule,
        MatIconModule
    ],
    templateUrl: './bezorglocaties.component.html'
})
export class BezorglocatiesComponent {
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  bezorglocatiesFormArray = new FormArray<FormGroup>([]);
  selectedBezorglocatieFormGroup = signal(this.bezorglocatiesFormArray.at(0)); 

  ngOnInit(): void {
    this.createFormArray();
    this.selectedBezorglocatieFormGroup.set(this.bezorglocatiesFormArray.at(0));
    this.formService.addChildFormArray('bezorglocaties', this.bezorglocatiesFormArray);
  }

  createFormArray(): void {
    BEZORGLOCATIES_DATA.forEach(data => {
      this.bezorglocatiesFormArray.push(this.formbuilder.group({
        id: [data.id],
        naam: [data.naam],
        adres: this.formbuilder.group({
          straat: [data.adres.straat],
          huisnummer: [data.adres.huisnummer, Validators.required],
          postcode: [data.adres.postcode, Validators.required],
          plaats: [data.adres.plaats],
          land: [data.adres.land]
        })
      }));
    });
  }

  get bezorglocatiesControls() {
    return this.bezorglocatiesFormArray.controls;
  }

  onSelectBezorglocatie(id: number): void {
    this.selectedBezorglocatieFormGroup.set(this.bezorglocatiesFormArray.controls
      .find((control) => control.get('id')?.value === id) as FormGroup)
  }
}