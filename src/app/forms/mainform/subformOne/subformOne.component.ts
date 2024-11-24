import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../form.service';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { conditionalValidator } from '../../validators/conditionalValidator';

@Component({
    selector: 'app-subone',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    templateUrl: './subformOne.component.html'
})
export class SubformOneComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  subformOne!: FormGroup;
  showOtherAnimalField = signal(false);

  ngOnInit(): void {
    this.createSubFormOne();
    this.formService.addChildFormGroup('subformOne', this.subformOne);
    this.showOtherAnimal();
  }

  createSubFormOne(): void {
    this.subformOne = this.formbuilder.group({
      lievelingskleur: [''],
      lievelingsdier: [''],
      anderLievelingsdier: ['', conditionalValidator(this.showOtherAnimalField, [Validators.required])],
      hobbies: ['']
    });
  }

  showOtherAnimal(): void {
   this.subformOne.get('lievelingsdier')?.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((value) => {
      if (value && value === 'anders') {
        this.showOtherAnimalField.set(true);
      } else {
      this.showOtherAnimalField.set(false);
      }
    });
  }
}
