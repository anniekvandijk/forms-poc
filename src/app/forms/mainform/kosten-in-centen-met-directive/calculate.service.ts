import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Kosten } from '../kosten/kosten.model';
import { KostenForm } from '../kosten/kostenForm.model';

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  calculateKosten(kostenForm: FormGroup<KostenForm>): Observable<Kosten> {
    
    const kostenformId = (Math.floor(Math.random() * 1000) + 1).toString();
  
    const kosten: Kosten = {
      id: kostenForm.controls.id.value || kostenformId,
      huisdieren: {
        alpacas: kostenForm.controls.huisdieren.controls.alpacas.value,
        honden: kostenForm.controls.huisdieren.controls.honden.value,
        totaal:
          kostenForm.controls.huisdieren.controls.alpacas.value +
          kostenForm.controls.huisdieren.controls.honden.value,
      },
      hobbies: {
        knutselen: kostenForm.controls.hobbies.controls.knutselen.value,
        gamen: kostenForm.controls.hobbies.controls.gamen.value,
        totaal:
          kostenForm.controls.hobbies.controls.knutselen.value +
          kostenForm.controls.hobbies.controls.gamen.value,
      },
      eten: {
        boodschappen: kostenForm.controls.eten.controls.boodschappen.value,
        uiteten: kostenForm.controls.eten.controls.uiteten.value,
        totaal:
          kostenForm.controls.eten.controls.boodschappen.value +
          kostenForm.controls.eten.controls.uiteten.value,
      },
      totaal:
        kostenForm.controls.huisdieren.controls.alpacas.value +
        kostenForm.controls.huisdieren.controls.honden.value +
        kostenForm.controls.hobbies.controls.knutselen.value +
        kostenForm.controls.hobbies.controls.gamen.value +
        kostenForm.controls.eten.controls.boodschappen.value +
        kostenForm.controls.eten.controls.uiteten.value,
    };
    return of(kosten);
  }
}
