import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-subone',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './subone.component.html',
})
export class SuboneComponent {
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  subformOne!: FormGroup;

  ngOnInit(): void {
    this.createSubFormOne();
    this.formService.addChildFormGroup('subone', this.subformOne);
  }

  createSubFormOne(): void {
    this.subformOne = this.formbuilder.group({
      naam: [''],
      hobby: ['']
    });
  }
}
