import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  MAT_DATE_LOCALE
} from '@angular/material/core';
//import { nl } from 'date-fns/locale';
//import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { routes } from './app.routes';

registerLocaleData(localeNl);

// https://momentjs.com/docs/#/displaying/
const CUSTOM_DATE_FORMATS_MOMENT = {
  parse : {
   // dateInput: 'LL',
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

// https://date-fns.org/v4.1.0/docs/format
const CUSTOM_DATE_FORMATS_DATE_FNS = {
  parse : {
    dateInput: 'yyyy-mm-dd',
  },
  display: {
    dateInput: 'dd-yyyy',
    monthYearLabel: 'mmm yyyy',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'mmmm yyyy',
  },
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        //appearance: 'outline',
        floatLabel: 'always',
      },
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'EUR',
    },
    {
      provide: LOCALE_ID,
      useValue: 'nl-NL',
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'nl-NL', // native, moment, 
     // useValue: nl, // date-fns
    },
    //provideDateFnsAdapter(CUSTOM_DATE_FORMATS_DATE_FNS),
    provideMomentDateAdapter(CUSTOM_DATE_FORMATS_MOMENT),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
  ]
};
