import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { delay } from 'rxjs';
import { FormService } from '../../form.service';
import { CalculateService } from './calculate.service';
import { EurocentsInputFieldDirective } from './eurocents-input.directive';
import { Kosten } from './kosten.model';
import { KostenForm } from './kostenForm.model';
import { PercentageInputFieldDirective } from './percentage-input.directive';

@Component({
  selector: 'app-kosten-in-centen-met-directive',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    EurocentsInputFieldDirective,
    PercentageInputFieldDirective,
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
            this.patchForm(kosten);
          }
        );
    });
  }

  createForm(): void {
    this.kostenForm = this.formbuilder.nonNullable.group({
      id: '',
      huisdieren: this.formbuilder.nonNullable.group({
        alpacas: 68,	
        honden: 655,
        percTotaal: 0.6438,
        totaal: 723,
      }),
      hobbies: this.formbuilder.nonNullable.group({
        knutselen: 0,
        gamen: 400,
        percTotaal: 0.3562,
        totaal: 400,
      }),
      eten: this.formbuilder.nonNullable.group({
        boodschappen: 0,
        uiteten: 0,
        percTotaal: 0,
        totaal: 0,
      }),
      totaal: 1123,
    });
  }

  patchForm(kosten: Kosten): void {
    // Only patch the values that are calculated
    // Else the fields you are working on will be reset
    // That is very annoying
    this.kostenForm.patchValue({
      id: kosten.id,
      huisdieren: {
        percTotaal: kosten.huisdieren.percTotaal,
        totaal: kosten.huisdieren.totaal,
      },
      hobbies: {
        percTotaal: kosten.hobbies.percTotaal,
        totaal: kosten.hobbies.totaal,
      },
      eten: {
        percTotaal: kosten.eten.percTotaal,
        totaal: kosten.eten.totaal,
      },
      totaal: kosten.totaal,
    }, 
    { 
      emitEvent: false 
    });
  }
}
