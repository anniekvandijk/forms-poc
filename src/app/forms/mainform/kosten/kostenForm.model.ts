import { FormControl, FormGroup } from '@angular/forms';

export interface KostenForm {
  id: FormControl<string>;
  huisdieren: FormGroup<HuisdierenForm>;
  hobbies: FormGroup<HobbiesForm>;
  eten: FormGroup<EtenForm>;
  totaal: FormControl<number>;
}

export interface HuisdierenForm {
  alpacas: FormControl<number>;
  honden: FormControl<number>;
  totaal: FormControl<number>;
}

export interface HobbiesForm {
  knutselen: FormControl<number>;
  gamen: FormControl<number>;
  totaal: FormControl<number>;
}

export interface EtenForm {
  boodschappen: FormControl<number>;
  uiteten: FormControl<number>;
  totaal: FormControl<number>;
}
