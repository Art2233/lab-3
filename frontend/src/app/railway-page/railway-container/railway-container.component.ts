import { Component, OnInit } from '@angular/core';
import { IStore } from '../../reducer';
import { Store } from '@ngrx/store';
import { InitActions } from '../storage/actions';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CitiesComponent } from './cities/cities.component';
import { selectCities, selectCitiesStorage, selectIsEditCityMode, selectIsNewCityMode, slectIsLoadingCity } from '../storage/entities/city/selector';
import { CommonModule } from '@angular/common';
import * as CitiesActions from '../storage/entities/city/actions';
import * as StationsActions from '../storage/entities/station/actions';
import * as TripActions from '../storage/entities/trip/actions';
import { StationsComponent } from './stations/stations.component';
import { selectIsEditStationMode, selectIsNewStationMode, selectStations, selectStationsStorage, slectIsLoadingStation } from '../storage/entities/station/selector';
import { TripsComponent } from './trips/trips.component';
import { selectIsEditTripMode, selectIsLoadingTrip, selectIsNewTripMode, selectTrips } from '../storage/entities/trip/selector';
import { combineLatest, map } from 'rxjs';

enum Tabs {
    Cities = 1,
    Stations = 2,
    Trips = 3,
}

@Component({
    selector: 'app-railway-container',
    imports: [NgbNavModule, CitiesComponent, CommonModule, StationsComponent, TripsComponent],
    templateUrl: './railway-container.component.html',
    styleUrl: './railway-container.component.scss',
})
export class RailwayContainerComponent implements OnInit {
    cities$ = this.store.select(selectCities);
    citiesStorage$ = this.store.select(selectCitiesStorage)
    isNewCityMode$ = this.store.select(selectIsNewCityMode);
    isEditCityMode$ = this.store.select(selectIsEditCityMode);
    isLoadingCity$ = this.store.select(slectIsLoadingCity);

    stations$ = this.store.select(selectStations);
    stationsStorage$ = this.store.select(selectStationsStorage);
    isStationsLoading$ = this.store.select(slectIsLoadingStation);
    isNewStationMode$ = this.store.select(selectIsNewStationMode);
    isEditStationMode$ = this.store.select(selectIsEditStationMode);

    trips$ = this.store.select(selectTrips);
    isLoadingTrip$ = this.store.select(selectIsLoadingTrip);
    isNewTripMode$ = this.store.select(selectIsNewTripMode);
    isEditTripMode$ = this.store.select(selectIsEditTripMode);

    isDisabledTab$ = combineLatest([
        this.isEditCityMode$,
        this.isEditStationMode$,
        this.isEditTripMode$,
        this.isNewCityMode$,
        this.isNewStationMode$,
        this.isNewTripMode$
    ]).pipe(
        map(flags => flags.some(Boolean))
    );

    activeTab = Tabs.Cities;
    Tabs = Tabs;

    CitiesActions = CitiesActions;
    StationsActions = StationsActions;
    TripActions = TripActions;

    constructor(
        public store: Store<IStore>,
    ) {}

    ngOnInit() {
        this.store.dispatch(InitActions());
    }
}
