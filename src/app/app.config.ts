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
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
//import { nl } from 'date-fns/locale'; // date-fns locale;
import 'moment/locale/nl' // moment locale;
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { routes } from './app.routes';

registerLocaleData(localeNl);

// https://momentjs.com/docs/#/displaying/
const CUSTOM_DATE_FORMATS_MOMENT = {
  parse : {
    //dateInput: 'LL',
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

// https://date-fns.org/v4.1.0/docs/format
// https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
const CUSTOM_DATE_FORMATS_DATE_FNS = {
  parse : {
    dateInput: 'dd-MM-yyyy',
  },
  display: {
    dateInput: 'd MMMM yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd MMMM yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
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
      useValue: 'nl-NL', // native
      //useValue: nl, // date-fns
    },
    //provideNativeDateAdapter(),
    //provideDateFnsAdapter(CUSTOM_DATE_FORMATS_DATE_FNS),
    provideMomentDateAdapter(CUSTOM_DATE_FORMATS_MOMENT),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
  ]
};
