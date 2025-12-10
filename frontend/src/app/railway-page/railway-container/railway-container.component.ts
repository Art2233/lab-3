import { Component, OnInit } from '@angular/core';
import { IStore } from '../../reducer';
import { Store } from '@ngrx/store';
import { InitActions } from '../storage/actions';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CitiesComponent } from './cities/cities.component';
import { selectCities, selectIsEditCityMode, selectIsNewCityMode } from '../storage/entities/city/selector';
import { CommonModule } from '@angular/common';
import * as CitiesActions from '../storage/entities/city/actions';

enum Tabs {
    Cities = 1,
    Stations = 2,
    Trips = 3,
}

@Component({
    selector: 'app-railway-container',
    imports: [NgbNavModule, CitiesComponent, CommonModule],
    templateUrl: './railway-container.component.html',
    styleUrl: './railway-container.component.scss',
})
export class RailwayContainerComponent implements OnInit {
    cities$ = this.store.select(selectCities);
    isNewCityMode$ = this.store.select(selectIsNewCityMode);
    isEditCityMode$ = this.store.select(selectIsEditCityMode);

    activeTab = Tabs.Cities;
    Tabs = Tabs;

    CitiesActions = CitiesActions;

    constructor(
        public store: Store<IStore>,
    ) {}

    ngOnInit() {
        this.store.dispatch(InitActions());
    }
}
