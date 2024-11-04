import { Component, inject, OnInit } from '@angular/core';
import { FormService } from '../form.service';
import { SubformOneComponent } from "./subformOne/subformOne.component";
import { SubformTwoComponent } from './subformTwo/subformTwo.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mainform',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SubformOneComponent, 
    SubformTwoComponent
  ],
  templateUrl: './mainform.component.html',
  providers: [FormService],
})
export class MainformComponent {
[x: string]: any;
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();

  ngOnInit(): void {
    this.formService.addChildFormControl('veld', this.formService.fb().control(''));
  }

  onSubmit() {
    this.formService.submitForm();
  }
}
