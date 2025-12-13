import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { IStore } from "../../../../reducer";
import { DeleteCityItemAction, SaveCityItemAction, ToggleEditCityModeAction, ToggleNewCityModeAction } from "./actions";
import { concat, filter, from, map, of, switchMap, withLatestFrom } from "rxjs";
import { selectCities, selectIsNewCityMode } from "./selector";
import { ExtendCityStateActions, ExtendStationStateActions, ExtendTripStateActions } from "../../actions";
import { ItemMode } from "../../reducer";
import { CityService } from "../../../../http/city.service";
import { prepareItems } from "../../utils/prepare";
import { ComfirmMoodalService } from "../../../../shared/comfirm-moodal/comfirm-moodal.service";
import { selectStations } from "../station/selector";
import { selectTrips } from "../trip/selector";

@Injectable()
export class CityEffects {
    constructor(
        private actions$: Actions,
        private store: Store<IStore>,
        private cityService: CityService,
        private comfirmMoodalService: ComfirmMoodalService,
    ) { }

    changeCityMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleEditCityModeAction),
            withLatestFrom(this.store.select(selectCities)),
            map(([{ cityId, mode }, cities]) => {
                return {
                    cities: cities.map((cityItem) => {
                        return cityItem.item.id === cityId
                            ? {
                                ...cityItem,
                                mode,
                            }
                            : cityItem;
                    }),
                    isEditCityMode: mode === ItemMode.Edit,
                }
            }),
            map((cityState) => ExtendCityStateActions({ cityState }))
        ),
    );

    toggleNewCityMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleNewCityModeAction),
            withLatestFrom(this.store.select(selectIsNewCityMode)),
            map(([_, isNewCityMode]) => ({ isNewCityMode: !isNewCityMode })),
            map((cityState) => ExtendCityStateActions({ cityState }))
        ),
    );

    saveItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SaveCityItemAction),
            withLatestFrom(
                this.store.select(selectCities),
                this.store.select(selectStations)
            ),
            switchMap(([{ item }, cities, stations]) => {
                const request = item.id === 0
                    ? this.cityService.create(item.name)
                    : this.cityService.edit(item);

                const city$ = request.pipe(
                    switchMap((newCity) => {
                        const updatedCities = item.id === 0
                            ? [
                                ...cities,
                                ...prepareItems([newCity]),
                            ]
                            : cities.map((cityItem) =>
                                cityItem.item.id === newCity.id
                                    ? {
                                        ...cityItem,
                                        item: newCity,
                                        mode: ItemMode.View,
                                    }
                                    : cityItem
                            );

                        const nextStations = stations.map((stationItem) => ({
                            ...stationItem,
                            city: stationItem.city.id === newCity.id ? newCity : stationItem.city,
                        }));

                        return concat(
                            of(ExtendCityStateActions({
                                cityState: {
                                    cities: updatedCities,
                                    citiesStorage: updatedCities.map(c => c.item),
                                    isNewCityMode: false,
                                    isEditCityMode: false,
                                    isLoading: false,
                                }
                            })),
                            of(ExtendStationStateActions({
                                stationState: {
                                    stations: nextStations,
                                    stationsStorage: nextStations.map(s => s.item),
                                }
                            }))
                        )
                    }),
                );

                return concat(
                    of(ExtendCityStateActions({
                        cityState: {
                            isLoading: true,
                        }
                    })),
                    city$,
                );
            }),
        ),
    );

    deleteItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteCityItemAction),
            withLatestFrom(
                this.store.select(selectCities),
                this.store.select(selectStations),
                this.store.select(selectTrips),
            ),
            switchMap(([{ cityId }, cities, stations, trips]) =>
                from(this.comfirmMoodalService.open('Are you sure you want to delete this city? All related data will be removed.')).pipe(
                    filter(confirmed => confirmed),
                    map(() => ({ cityId, cities, stations, trips }))
                )
            ),
            switchMap(({ cityId, cities, stations, trips }) => {
                const request$ = this.cityService.delete(cityId).pipe(
                    switchMap(() => {
                        const updatedCities = cities.filter(
                            (cityItem) => cityItem.item.id !== cityId
                        );

                        const updatedStations = stations.filter((stationItem) => stationItem.city.id !== cityId);
                        const updatedTrips = trips.filter((tripItem) => 
                            updatedStations.some(s => s.item.id === tripItem.item.arrivalStationId) &&
                            updatedStations.some(s => s.item.id === tripItem.item.departureStationId)
                        );

                        return concat(
                            of(ExtendCityStateActions({
                                cityState: {
                                    cities: updatedCities,
                                    citiesStorage: updatedCities.map(c => c.item),
                                    isLoading: false,
                                }
                            })),
                            of(ExtendStationStateActions({
                                stationState: {
                                    stations: updatedStations,
                                    stationsStorage: updatedStations.map(s => s.item),
                                    isLoading: false,
                                }
                            })),
                            of(ExtendTripStateActions({
                                tripState: {
                                    trips: updatedTrips,
                                    tripsStorage: updatedTrips.map(t => t.item),
                                    isLoading: false,
                                }
                            })),
                        );
                    }),
                );

                return concat(
                    of(ExtendCityStateActions({
                        cityState: {
                            isLoading: true,
                        }
                    })),
                    request$,
                )
            }),
            // map((cityState) => ExtendCityStateActions({ cityState }))
        )
    );
}