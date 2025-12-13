import { createSelector } from "@ngrx/store";
import { IStation } from "../../../../http/station.service";
import { IItem, ItemMode, selectRailwayState } from "../../reducer";
import { ICity } from "../../../../http/city.service";

export interface IStationItem extends IItem<IStation> {
    city: ICity;
}

export interface IStationSelector {
    stationsStorage: IStation[];
    stations: IStationItem[];
    isNewStationMode: boolean;
    isEditStationMode: boolean;
    isLoading: boolean;
}

export const selectStationSelector = createSelector(
    selectRailwayState,
    (state) => state.stationState,
);

export const selectStations = createSelector(
    selectStationSelector,
    (stationState) => stationState.stations,
);

export const selectStationsStorage = createSelector(
    selectStationSelector,
    (stationState) => stationState.stationsStorage,
);

export const selectIsNewStationMode = createSelector(
    selectStationSelector,
    (stationState) => stationState.isNewStationMode,
);

export const selectIsEditStationMode = createSelector(
    selectStationSelector,
    (stationState) => stationState.isEditStationMode,
);

export const slectIsLoadingStation = createSelector(
    selectStationSelector,
    (stationState) => stationState.isLoading,
);

export function generateNewStationItem(mode: ItemMode = ItemMode.View): IStationItem {
    return {
        mode,
        item: {
            id: 0,
            name: '',
            cityId: 0,
        },
        city: {
            id: 0,
            name: '',
        }
    }
}