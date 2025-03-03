import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

registerLocaleData(localeNl);

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
      useValue: 'nl-NL',
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ]
};
