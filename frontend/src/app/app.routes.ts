import { Routes } from '@angular/router';
import { NonInjection } from './non-injection/non-injection';
import { MainPage } from './main-page/main-page';
import { RailwayContainerComponent } from './railway-page/railway-container/railway-container.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => MainPage,
    },
    {
        path: 'non-injected',
        loadComponent: () => NonInjection,
    },
    {
        path: 'railway',
        loadComponent: () => RailwayContainerComponent,
    }
];
