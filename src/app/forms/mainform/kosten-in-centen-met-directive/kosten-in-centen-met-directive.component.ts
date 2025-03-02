import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { delay } from 'rxjs';
import { FormService } from '../../form.service';
import { Kosten } from '../kosten/kosten.model';
import { KostenForm } from '../kosten/kostenForm.model';
import { CalculateService } from './calculate.service';
import { EurocentsInputFieldDirective } from './eurocents-input.directive';

@Component({
  selector: 'app-kosten-in-centen-met-directive',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    EurocentsInputFieldDirective,
  ],
  templateUrl: './kosten-in-centen-met-directive.component.html',
  styleUrls: ['./kosten-in-centen-met-directive.component.scss'],
})
export class KostenInCentenMetDirectiveComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  private readonly calculateService = inject(CalculateService);
  mainform = this.formService.formSignal();
  kostenForm!: FormGroup<KostenForm>;
  kosten: Kosten | undefined;

  ngOnInit(): void {
    this.createForm();
    this.formService.addChildFormGroup('kosten2', this.kostenForm);
    this.kostenForm.valueChanges
      .pipe(
        delay(400),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.calculateService.calculateKosten(this.kostenForm)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(kosten => {
            this.kosten = kosten;
            this.patchForm(kosten);
          }
        );
    });
  }

  createForm(): void {
    this.kostenForm = this.formbuilder.nonNullable.group({
      id: '',
      huisdieren: this.formbuilder.nonNullable.group({
        alpacas: 0,
        honden: 0,
        totaal: 0,
      }),
      hobbies: this.formbuilder.nonNullable.group({
        knutselen: 0,
        gamen: 0,
        totaal: 0,
      }),
      eten: this.formbuilder.nonNullable.group({
        boodschappen: 0,
        uiteten: 0,
        totaal: 0,
      }),
      totaal: 0,
    });
  }

  patchForm(kosten: Kosten): void {
    this.kostenForm.patchValue(kosten, { emitEvent: false });
  }
}
