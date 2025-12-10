import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiBaseUrlInterceptor } from './http/api-base-url.interceptor';
import { EFFECTS } from './app.effects';
import { reducers } from './reducer';

export const appConfig: ApplicationConfig = {
    providers: [
        provideEffects(EFFECTS),
        provideStore(reducers),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([apiBaseUrlInterceptor])),
    ]
};
