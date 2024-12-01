import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { FormService } from '../form.service';
import { PersoonlijkeInformatieComponent } from "./persoonlijke-informatie/persoonlijke-informatie.component";
import { AdresgegevensComponent } from './adresgegevens/adresgegevens.component';
import { BezorglocatiesComponent } from "./bezorglocaties/bezorglocaties.component";

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
    BezorglocatiesComponent
],
    templateUrl: './mainform.component.html',
    providers: [FormService]
})
export class MainformComponent {
[x: string]: any;
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  showFormValues = signal(false);

  ngOnInit(): void {
    this.formService.addChildFormControl('naam', this.formService.fb().control('', [Validators.required]));
  }

  toggleFormValuesSection() {
    this.showFormValues.update(value => !value);
  }

  onSubmit() {
    this.formService.submitForm();
  }
}
