import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CustomMatAutocomplete3Component } from '../../custom-formfields/custom-mat-autocomplete-3/custom-mat-autocomplete-3.component';
import { CustomMatAutocomplete2Component } from '../../custom-formfields/custom-mat-autocomplete-2/custom-mat-autocomplete-2.component';
import { FormService } from '../../form.service';
import { CustomMatAutocompleteComponent } from '../../custom-formfields/custom-mat-autocomplete/custom-mat-autocomplete.component';
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { PersoonlijkeInformatie } from './persoonlijke-informatie.model';
import { CustomMatAutocomplete4Component } from '../../custom-formfields/custom-mat-autocomplete-4/custom-mat-autocomplete-4.component';
import { AutocompleteOptions } from '../../custom-formfields/custom-mat-autocomplete-4/autocomplete-options';

@Component({
  selector: 'app-persoonlijke-informatie',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatAutocompleteModule,
    CustomMatAutocompleteComponent,
    CustomMatAutocomplete2Component,
    CustomMatAutocomplete3Component,
    CustomMatAutocomplete4Component
  ],
  templateUrl: './persoonlijke-informatie.component.html',
})
export class PersoonlijkeInformatieComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formbuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  mainform = this.formService.formSignal();
  kleurenOptions = signal<AutocompleteOptions[]>([]);
  persoonlijkeInformatie!: FormGroup<PersoonlijkeInformatie>;
  showAnderLievelingsdierField = signal(false);
  anderlievelingsdierMaxlength = signal(20);
  waaromDitDierMaxlength = signal(50);	

  ngOnInit(): void {
    this.createForm();
    this.formService.addChildFormGroup(
      'persoonlijkeInformatie',
      this.persoonlijkeInformatie,
    );
    this.kleurenOptions.set([
      { key: '1', value: '1 - rood' },
      { key: '2', value: '2 - blauw' },
      { key: '3', value: '3 - groen' },
      { key: '4', value: '4 - geel' },
      { key: '5', value: '5 - oranje' },
      { key: '6', value: '6 - paars' },
      { key: '7', value: '7 - zwart' },
      { key: '8', value: '8 - wit' },
      { key: '9', value: '9 - grijs' },
      { key: '10', value: '10 - bruin' },
    ]);
  }

  /* START - Autocomplete components */
  @ViewChild('autocompleteinput')
  autocompleteinput!: ElementRef<HTMLInputElement>;
  @ViewChild('autocompleteselect') autocompleteselect!: MatAutocomplete;
  private filterValue = signal<string>('');

  filteredOptions = computed(() => {
    return this.kleuren.filter((option) =>
      option.toLowerCase().includes(this.filterValue().toLowerCase()),
    );
  });

  filter(): void {
    this.filterValue.set(
      this.autocompleteinput.nativeElement.value.toLowerCase(),
    );
  }

  clearAutocompleteInput(): void {
    this.autocompleteselect.options.forEach((option) => option.deselect());
    this.persoonlijkeInformatie.controls.kleur1?.setValue('');
  }

  /* END - Autocomplete component */

  createForm(): void {
    this.persoonlijkeInformatie = this.formbuilder.nonNullable.group({
      kleur1: [{ value: '', disabled: false }, Validators.required], // in formulier
      kleur2: [{ value: '', disabled: false }, Validators.required],
      kleur3b: [''],
      kleur4: [{ value: '', disabled: false }, Validators.required],
      kleur5: [{ value: '2', disabled: false }, Validators.required],
      lievelingsdier: ['', Validators.required],
      anderLievelingsdier: [''],
      waaromDitDier: [''],
      hobbies: [''],
    });
  }

  addFormControlToParentForm(
    formControlname: string,
    formControl: FormControl,
  ): void {
    this.persoonlijkeInformatie.addControl(formControlname, formControl);
    // aangezien je niet weet welke formControl je toevoegt,
    // kun je niet de juiste validatie toevoegen
    // ook kan dit kan heel verwarrend zijn, want dit staat niet in de interface
  }

  setKleur3bParentForm(formControl: FormControl): void {
    this.persoonlijkeInformatie.setControl('kleur3b', formControl);
    this.persoonlijkeInformatie
      .get('kleur3b')
      ?.addValidators(Validators.required);
    // Je overschijft een bestaande formControl die in de interface staat,
    // je kunt de validatie toevoegen
    // maar dit kan heel verwarrend zijn
  }

  addKleur3cToParentForm(formControl: FormControl): void {
    this.persoonlijkeInformatie.addControl('kleur3c', formControl);
    this.persoonlijkeInformatie
      .get('kleur3c')
      ?.addValidators(Validators.required);
    // Je voegt een formControl toe,
    // je kunt de validatie toevoegen
    // maar dit kan heel verwarrend zijn, want dit staat niet in de interface
  }

  kleuren = [
    'rood',
    'blauw',
    'groen',
    'geel',
    'oranje',
    'paars',
    'zwart',
    'wit',
    'grijs',
    'bruin',
  ];

  onLievelingsdierChange(event: MatSelectChange): void {
    if (event.value === 'anders') {
      this.showAnderLievelingsdierField.set(true);
      this.anderLievelingsdierControl?.setValidators([
        Validators.required,
        Validators.maxLength(this.anderlievelingsdierMaxlength()),
      ]);
    } else {
      this.showAnderLievelingsdierField.set(false);
      this.anderLievelingsdierControl?.clearValidators();
    }
    this.anderLievelingsdierControl?.updateValueAndValidity({
      emitEvent: false,
      onlySelf: true,
    });
  }

  get anderLievelingsdierControl() {
    return this.persoonlijkeInformatie.controls.anderLievelingsdier;
  }

  get waaromDitDierControl() {
    return this.persoonlijkeInformatie.controls.waaromDitDier;
  }
}
