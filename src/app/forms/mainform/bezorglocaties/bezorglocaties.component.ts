import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../form.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { BEZORGLOCATIES_DATA } from './bezorglocaties-data';

@Component({
    selector: 'app-bezorglocaties',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatRadioModule,
        MatDividerModule
    ],
    templateUrl: './bezorglocaties.component.html'
})
export class BezorglocatiesComponent {
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  bezorglocatiesFormArray = new FormArray<FormGroup>([]);
  selectedBezorglocatieFormGroup = signal(this.bezorglocatiesFormArray.controls[0]); 

  ngOnInit(): void {
    this.createFormArray();
    this.selectedBezorglocatieFormGroup.set(this.bezorglocatiesFormArray.controls[0]);
    this.formService.addChildFormArray('bezorglocaties', this.bezorglocatiesFormArray);
  }

  createFormArray(): void {
    BEZORGLOCATIES_DATA.forEach(data => {
      this.bezorglocatiesFormArray.push(this.formbuilder.group({
        id: [data.id],
        naam: [data.naam],
        adres: this.formbuilder.group({
          straat: [data.adres.straat],
          postcode: [data.adres.postcode],
          plaats: [data.adres.plaats]
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