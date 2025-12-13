import { Routes } from '@angular/router';
import { TestReq } from './test-req/test-req';
import { MainPage } from './main-page/main-page';
import { RailwayContainerComponent } from './railway-page/railway-container/railway-container.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => MainPage,
    },
    {
        path: 'test-req',
        loadComponent: () => TestReq,
    },
    {
        path: 'railway',
        loadComponent: () => RailwayContainerComponent,
    }
];
