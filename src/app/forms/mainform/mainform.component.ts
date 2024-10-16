import { Component, inject, OnInit } from '@angular/core';
import { FormService } from '../form.service';
import { SuboneComponent } from "./subone/subone.component";
import { SubtwoComponent } from './subtwo/subtwo.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mainform',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SuboneComponent, 
    SubtwoComponent
  ],
  templateUrl: './mainform.component.html',
  providers: [FormService],
})
export class MainformComponent {
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();

  onSubmit() {
    this.formService.submitForm();
  }
}
