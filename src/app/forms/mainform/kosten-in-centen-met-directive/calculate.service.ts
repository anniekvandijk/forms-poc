import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Kosten } from './kosten.model';
import { KostenForm } from './kostenForm.model';

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  calculateKosten(kostenForm: FormGroup<KostenForm>): Observable<Kosten> {
    
    const kostenformId = (Math.floor(Math.random() * 1000) + 1).toString();

    const totaalHuisdieren = 
      kostenForm.controls.huisdieren.controls.alpacas.value +
      kostenForm.controls.huisdieren.controls.honden.value;
    
    const totaalHobbies =
      kostenForm.controls.hobbies.controls.knutselen.value +
      kostenForm.controls.hobbies.controls.gamen.value;

    const totaalEten =
      kostenForm.controls.eten.controls.boodschappen.value +
      kostenForm.controls.eten.controls.uiteten.value;

    const totaal =
      totaalHuisdieren +
      totaalHobbies +
      totaalEten;
    
    const percTotaalHuisdieren = (totaalHuisdieren / totaal);
    const percTotaalHobbies = (totaalHobbies / totaal);
    console.log('perc', percTotaalHobbies);
    const percTotaalEten = (totaalEten / totaal);
  
    const kosten: Kosten = {
      id: kostenForm.controls.id.value || kostenformId,
      huisdieren: {
        alpacas: kostenForm.controls.huisdieren.controls.alpacas.value,
        honden: kostenForm.controls.huisdieren.controls.honden.value,
        percTotaal: percTotaalHuisdieren,
        totaal: totaalHuisdieren,
      },
      hobbies: {
        knutselen: kostenForm.controls.hobbies.controls.knutselen.value,
        gamen: kostenForm.controls.hobbies.controls.gamen.value,
        percTotaal: percTotaalHobbies,
        totaal: totaalHobbies,
      },
      eten: {
        boodschappen: kostenForm.controls.eten.controls.boodschappen.value,
        uiteten: kostenForm.controls.eten.controls.uiteten.value,
        percTotaal: percTotaalEten,
        totaal: totaalEten,
      },
      totaal: totaal,
    };
    return of(kosten);
  }
}
