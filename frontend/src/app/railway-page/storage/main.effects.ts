import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ExtendCityStateActions, ExtendStationStateActions, ExtendTripStateActions, InitActions } from "./actions";
import { concat, map, of, switchMap, withLatestFrom } from "rxjs";
import { CityService } from "../../http/city.service";
import { prepareItems } from "./utils/prepare";
import { StationService } from "../../http/station.service";
import { Store } from "@ngrx/store";
import { IStore } from "../../reducer";
import { selectCities } from "./entities/city/selector";
import { TripService } from "../../http/trip.service";
import { selectStations } from "./entities/station/selector";

@Injectable({
    providedIn: 'root',
})
export class MainEffects {
    constructor(
        private actions$: Actions,
        private store: Store<IStore>,
        private cityService: CityService,
        private stationService: StationService,
        private tripService: TripService,
    ) {}

    init$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InitActions),
            switchMap(() => {
                const loadings$ = concat(
                    of(ExtendCityStateActions({ cityState: { isLoading: true } })),
                    of(ExtendStationStateActions({ stationState: { isLoading: true } })),
                    of(ExtendTripStateActions({ tripState: { isLoading: true } })),
                );

                const cities$ = this.cityService.getList().pipe(
                    map((cities) => ExtendCityStateActions({
                        cityState: {
                            citiesStorage: cities,
                            cities: prepareItems(cities),
                            isLoading: false,
                        }
                    })),
                );

                const stations$ = this.stationService.getList().pipe(
                    withLatestFrom(this.store.select(selectCities)),
                    map(([stations, cities]) => ExtendStationStateActions({
                        stationState: {
                            stationsStorage: stations,
                            stations: prepareItems(stations).map(station => ({
                                ...station,
                                city: cities.find((c) => c.item.id == station.item.cityId)!.item,
                            })),
                            isLoading: false,
                        }
                    })),
                );

                const trips$ = this.tripService.getList().pipe(
                    withLatestFrom(this.store.select(selectStations)),
                    map(([trips, stations]  ) => ExtendTripStateActions({
                        tripState: {
                            tripsStorage: trips,
                            trips: prepareItems(trips).map(trip => ({
                                ...trip,
                                arrivalStation: stations.find(s => s.item.id == trip.item.arrivalStationId)!,
                                departureStation: stations.find(s => s.item.id == trip.item.departureStationId)!,
                            })),
                            isLoading: false,
                        }
                    })),
                );

                return concat(
                    loadings$,
                    cities$,
                    stations$,
                    trips$,
                );
            }),
        ),
    );
}