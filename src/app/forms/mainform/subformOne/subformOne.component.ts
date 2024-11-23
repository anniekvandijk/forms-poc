import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../form.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-subone',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './subformOne.component.html'
})
export class SubformOneComponent {
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  subformOne!: FormGroup;

  ngOnInit(): void {
    this.createSubFormOne();
    this.formService.addChildFormGroup('subformOne', this.subformOne);
  }

  createSubFormOne(): void {
    this.subformOne = this.formbuilder.group({
      naam: [''],
      hobby: ['']
    });
  }
}
