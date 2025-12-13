import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { IStore } from "../../../../reducer";
import { IStation, StationService } from "../../../../http/station.service";
import { DeleteStationAction, SaveStationAction, ToggleEditStationModeAction, ToggleNewStationModeAction } from "./actions";
import { concat, filter, from, map, of, switchMap, withLatestFrom } from "rxjs";
import { IStationItem, selectIsNewStationMode, selectStations } from "./selector";
import { ExtendStationStateActions, ExtendTripStateActions } from "../../actions";
import { ItemMode } from "../../reducer";
import { ICity } from "../../../../http/city.service";
import { selectCitiesStorage } from "../city/selector";
import { ComfirmMoodalService } from "../../../../shared/comfirm-moodal/comfirm-moodal.service";
import { selectTrips } from "../trip/selector";

@Injectable()
export class StationEffects {
    constructor(
        private actions$: Actions,
        private store: Store<IStore>,
        private stationService: StationService,
        private comfirmMoodalService: ComfirmMoodalService,
    ) { }

    changeStationMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleEditStationModeAction),
            withLatestFrom(this.store.select(selectStations)),
            map(([{ stationId, mode }, stations]) => {
                return {
                    stations: stations.map((stationItem) => {
                        return stationItem.item.id === stationId
                            ? {
                                ...stationItem,
                                mode,
                            }
                            : stationItem;
                    }),
                    isEditStationMode: mode === ItemMode.Edit,
                }
            }),
            map((stationState) => ExtendStationStateActions({ stationState }))
        ),
    );

    toggleNewStationMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleNewStationModeAction),
            withLatestFrom(this.store.select(selectIsNewStationMode)),
            map(([_, isNewStationMode]) => ({ isNewStationMode: !isNewStationMode })),
            map((stationState) => ExtendStationStateActions({ stationState }))
        ),
    );

    saveStation$ = createEffect(() => 
        this.actions$.pipe(
            ofType(SaveStationAction),
            withLatestFrom(
                this.store.select(selectStations),
                this.store.select(selectCitiesStorage)
            ),
            switchMap(([{ item }, stations, cities]) => {
                const { id, ...newStation } = item;
                const request$ = item.id
                    ? this.stationService.edit(item)
                    : this.stationService.create(newStation);

                const station$ = request$.pipe(
                    map((newStation) => {
                        const updatedStations = item.id == 0
                            ? [
                                ...stations,
                                this.prepareStations(newStation, cities),
                            ]
                            : stations.map((stationItem) =>
                                stationItem.item.id === newStation.id
                                    ? this.prepareStations(newStation, cities)
                                    : stationItem
                            );

                        return {
                            stations: updatedStations,
                            stationsStorage: updatedStations.map(s => s.item),
                            isNewStationMode: false,
                            isEditStationMode: false,
                            isLoading: false,
                        }
                    })
                );

                return concat(
                    of({
                        isLoading: true,
                    }),
                    station$
                )
            }),
            map((stationState) => ExtendStationStateActions({ stationState }))
        ),
    );

    deleteStation$ = createEffect(() => 
        this.actions$.pipe(
            ofType(DeleteStationAction),
            withLatestFrom(
                this.store.select(selectStations),
                this.store.select(selectTrips),
            ),
            switchMap(([{ stationId }, stations, trips]) =>
                from(this.comfirmMoodalService.open('Are you sure you want to delete this station? All related data will be removed.')).pipe(
                    filter(confirmed => confirmed),
                    map(() => ({ stationId, stations, trips }))
                )
            ),
            switchMap(({ stationId, stations, trips }) => {

                const deletion$ =  this.stationService.delete(stationId).pipe(
                    switchMap(() => {
                        const updatedStations = stations.filter(stationItem => stationItem.item.id !== stationId);
                        return concat(
                            of(ExtendStationStateActions({
                                stationState: {
                                    stations: updatedStations,
                                    stationsStorage: updatedStations.map(s => s.item),
                                    isLoading: false,
                                }
                            })),
                            of(ExtendTripStateActions({
                                tripState: {
                                    trips: trips.filter(trip => 
                                        trip.item.arrivalStationId !== stationId &&
                                        trip.item.departureStationId !== stationId
                                    ),
                                }
                            })),
                        )
                    }),
                );

                return concat(
                    of(ExtendStationStateActions({ stationState: { isLoading: true } })),
                    deletion$
                );
            }),
        ),
    );

    public prepareStations(stations: IStation, cities: ICity[]): IStationItem {
        return {
            item: stations,
            mode: ItemMode.View,
            city: cities.find((c) => c.id == stations.cityId)!,
        }
    }
}