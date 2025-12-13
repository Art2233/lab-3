import { createSelector } from "@ngrx/store";
import { ITrip } from "../../../../http/trip.service";
import { ItemMode, selectRailwayState } from "../../reducer";
import { generateNewStationItem, IStationItem } from "../station/selector";

export interface ITripItem {
    item: ITrip;
    mode: ItemMode;
    departureStation: IStationItem;
    arrivalStation: IStationItem;
}

export interface ITripSelector {
    tripsStorage: ITrip[];
    trips: ITripItem[];
    isNewTripMode: boolean;
    isEditTripMode: boolean;
    isLoading: boolean;
}

export const selectTripSelector = createSelector(
    selectRailwayState,
    (state) => state.tripState,
);

export const selectTrips = createSelector(
    selectTripSelector,
    (tripState) => tripState.trips,
);

export const selectTripsStorage = createSelector(
    selectTripSelector,
    (tripState) => tripState.tripsStorage,
);

export const selectIsNewTripMode = createSelector(
    selectTripSelector,
    (tripState) => tripState.isNewTripMode,
);

export const selectIsEditTripMode = createSelector(
    selectTripSelector,
    (tripState) => tripState.isEditTripMode,
);

export const selectIsLoadingTrip = createSelector(
    selectTripSelector,
    (tripState) => tripState.isLoading,
);

export function generateNewTripItem(mode: ItemMode = ItemMode.View): ITripItem {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return {
        mode,
        item: {
            id: 0,
            arrivalStationId: 0,
            departureStationId: 0,
            departureTime: formatDateWithMicroseconds(),
            arrivalTime: formatDateWithMicroseconds(tomorrow),
            trainNumber: '',
        },
        departureStation: generateNewStationItem(),
        arrivalStation: generateNewStationItem(),
    }
}

function formatDateWithMicroseconds(date = new Date()): string {
    const pad = (n: number, w = 2) => String(n).padStart(w, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    const micro = String(date.getMilliseconds()).padStart(3, '0') + '000';
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}.${micro}`;
};