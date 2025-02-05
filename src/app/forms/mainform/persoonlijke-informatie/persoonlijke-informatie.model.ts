import { AbstractControl, FormControl } from "@angular/forms";

export interface PersoonlijkeInformatie {
  // By adding the index signature [key: string]: AbstractControl<any>;, 
  // you allow the FormGroup to accept any string key, 
  // making it possible to add controls dynamically 
  // without encountering type errors.
  [key: string]: AbstractControl<any>;
  kleur1: FormControl<string>;
  kleur2: FormControl<string>;
  kleur3b: FormControl<string>;
  kleur4: FormControl<string>;
  lievelingsdier: FormControl<string>;
  anderLievelingsdier: FormControl<string>;
  hobbies: FormControl<string>;
}