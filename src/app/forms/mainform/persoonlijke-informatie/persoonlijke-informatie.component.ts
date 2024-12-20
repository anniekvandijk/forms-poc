import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../form.service';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { CustomAutocompleteComponent } from "../../custom-formfields/autocomplete/autocomplete.component";

@Component({
    selector: 'app-persoonlijke-informatie',
    imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    CustomAutocompleteComponent
],
    templateUrl: './persoonlijke-informatie.component.html'
})
export class PersoonlijkeInformatieComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  persoonlijkeInformatie!: FormGroup;
  showAnderLievelingsdierField = signal(false);
  anderlievelingsdierMaxlength = signal(20);

  ngOnInit(): void {
    this.createForm();
    this.formService.addChildFormGroup('persoonlijkeInformatie', this.persoonlijkeInformatie);
    this.showAnderLievelingsdier();
  }

  createForm(): void {
    this.persoonlijkeInformatie = this.formbuilder.group({
      kleur: [{ value: 'lila', disabled: false }],
      lievelingsdier: [''],
      anderLievelingsdier: [''],
      hobbies: ['']
    });
  }

  kleuren = ['rood', 'blauw', 'groen', 'geel', 'oranje', 'paars', 'zwart', 'wit', 'grijs', 'bruin'];

  get lievelingskleurControl() {
    return this.persoonlijkeInformatie.get('lievelingskleur');
  }

  get lievelingsdierControl() {
    return this.persoonlijkeInformatie.get('lievelingsdier');
  }

  get anderLievelingsdierControl() {
    return this.persoonlijkeInformatie.get('anderLievelingsdier');
  }

  private showAnderLievelingsdier(): void {
    this.lievelingsdierControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value && value === 'anders') {
          this.showAnderLievelingsdierField.set(true);
          this.anderLievelingsdierControl?.setValidators([Validators.required, Validators.maxLength(this.anderlievelingsdierMaxlength())]);
        } else {
          this.showAnderLievelingsdierField.set(false);
          this.anderLievelingsdierControl?.clearValidators();
        }
        this.anderLievelingsdierControl?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
      });
  }
}

