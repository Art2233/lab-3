import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { IStore } from "../../../../reducer";
import { DeleteTripAction, SaveTripAction, ToggleEditTripModeAction, ToggleNewTripModeAction } from "./actions";
import { concat, map, of, switchMap, withLatestFrom } from "rxjs";
import { ItemMode } from "../../reducer";
import { ExtendTripStateActions } from "../../actions";
import { ITripItem, selectIsNewTripMode, selectTrips } from "./selector";
import { ITrip, TripService } from "../../../../http/trip.service";
import { IStationItem, selectStations } from "../station/selector";

@Injectable()
export class TripEffects {
    constructor(
        private actions$: Actions,
        private store: Store<IStore>,
        private tripService: TripService,
    ) {}

    changeTripMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleEditTripModeAction),
            withLatestFrom(this.store.select(selectTrips)),
            map(([{ tripId, mode }, trips]) => {
                return {
                    trips: trips.map((tripItem) => {
                        return tripItem.item.id === tripId
                            ? {
                                ...tripItem,
                                mode,
                            }
                            : tripItem;
                    }),
                    isEditTripMode: mode === ItemMode.Edit,
                }
            }),
            map((tripState) => ExtendTripStateActions({ tripState }))
        ),
    );

    toggleNewStationMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleNewTripModeAction),
            withLatestFrom(this.store.select(selectIsNewTripMode)),
            map(([_, isNewTripMode]) => ({ isNewTripMode: !isNewTripMode })),
            map((tripState) => ExtendTripStateActions({ tripState }))
        ),
    );

    saveItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SaveTripAction),
            withLatestFrom(this.store.select(selectTrips)),
            switchMap(([{ item }, trips]) => {
                const { id, ...newTrip } = item;
                const request$ = id
                    ? this.tripService.edit(item)
                    : this.tripService.create(newTrip);

                const trip$ = request$.pipe(
                    withLatestFrom(this.store.select(selectStations)),
                    map(([newTrip, stations]) => {
                        const updatedTrips = id
                            ? trips.map((trip) =>
                                trip.item.id === id ? this.prepareTripItem(newTrip, stations) : trip)
                            : [...trips, this.prepareTripItem(newTrip, stations)];

                        return {
                            trips: updatedTrips,
                            isNewTripMode: false,
                            isEditTripMode: false,
                            isLoading: false,
                        }
                    })
                );

                return concat(
                    of({ isLoading: true }),
                    trip$
                )
            }),
            map((tripState) => ExtendTripStateActions({ tripState }))
        )
    );

    deleteItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteTripAction),
            withLatestFrom(this.store.select(selectTrips)),
            switchMap(([{ tripId }, trips]) => {
                return this.tripService.delete(tripId).pipe(
                    map(() => {
                        const updatedTrips = trips.filter(trip => trip.item.id !== tripId);
                        return { trips: updatedTrips };
                    }
                ));
            }),
            map((tripState) => ExtendTripStateActions({ tripState }))
        ),
    );


    private prepareTripItem(tripItem: ITrip, stations: IStationItem[]): ITripItem {
        return {
            item: tripItem,
            mode: ItemMode.View,
            arrivalStation: stations.find(s => s.item.id == tripItem.arrivalStationId)!,
            departureStation: stations.find(s => s.item.id == tripItem.departureStationId)!,
        }
    }
}