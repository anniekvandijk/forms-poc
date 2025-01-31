import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomAutocompleteComponent } from "../../custom-formfields/autocomplete/autocomplete.component";
import { FormService } from '../../form.service';

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
      kleur: [{ value: '', disabled: false }],
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

