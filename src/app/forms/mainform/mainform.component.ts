import { Component, inject } from '@angular/core';
import { FormService } from '../form.service';
import { SubformOneComponent } from "./subformOne/subformOne.component";
import { SubformTwoComponent } from './subformTwo/subformTwo.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-mainform',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        SubformOneComponent,
        SubformTwoComponent
    ],
    templateUrl: './mainform.component.html',
    providers: [FormService]
})
export class MainformComponent {
[x: string]: any;
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();

  ngOnInit(): void {
    this.formService.addChildFormControl('naam', this.formService.fb().control('', [Validators.required]));
  }

  onSubmit() {
    this.formService.submitForm();
  }
}
