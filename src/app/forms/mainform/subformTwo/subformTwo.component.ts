import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-subtwo',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './subformTwo.component.html',
})
export class SubformTwoComponent {
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  subformTwo!: FormGroup;

  ngOnInit(): void {
    this.createSubFormTwo();
    this.formService.addChildFormGroup('subformTwo', this.subformTwo);
  }

  createSubFormTwo(): void {
    this.subformTwo = this.formbuilder.group({
      straat: [''],
      postcode: [''],
      plaats: ['']
    });
  }
}
