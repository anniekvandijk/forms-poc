import { Component, inject, OnInit } from '@angular/core';
import { FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { FormService } from '../form.service';
import { PersoonlijkeInformatieComponent } from './persoonlijke-informatie/persoonlijke-informatie.component';
import { AdresgegevensComponent } from './adresgegevens/adresgegevens.component';
import { BezorglocatiesComponent } from './bezorglocaties/bezorglocaties.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mainform',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PersoonlijkeInformatieComponent,
    AdresgegevensComponent,
    MatCardModule,
    BezorglocatiesComponent,
    MatIconModule,
  ],
  templateUrl: './mainform.component.html',
  providers: [FormService],
})
export class MainformComponent implements OnInit {
  [x: string]: any;
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();

  ngOnInit(): void {
    this.formService.addChildFormControl(
      'naam',
      this.formService.fb().control('', [Validators.required]),
    );
  }

  onSubmit() {
    this.formService.submitForm();
  }

  get bezorglocatiesControls() {
    return (this.mainform.get('bezorglocaties') as FormArray).controls;
  }
}
