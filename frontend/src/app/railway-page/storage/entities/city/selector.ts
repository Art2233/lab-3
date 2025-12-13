import { createSelector } from "@ngrx/store";
import { ICity } from "../../../../http/city.service";
import { IItem, ItemMode, selectRailwayState } from "../../reducer";

export interface ICityState {
    citiesStorage: ICity[];
    cities: IItem<ICity>[];
    isNewCityMode: boolean;
    isEditCityMode: boolean;
    isLoading: boolean;
}

export const selectCitySelector = createSelector(
    selectRailwayState,
    (state) => state.cityState,
);

export const selectCities = createSelector(
    selectCitySelector,
    (cityState) => cityState.cities,
);

export const selectCitiesStorage = createSelector(
    selectCitySelector,
    (cityState) => cityState.citiesStorage,
);

export const selectIsNewCityMode = createSelector(
    selectCitySelector,
    (cityState) => cityState.isNewCityMode,
);

export const selectIsEditCityMode = createSelector(
    selectCitySelector,
    (cityState) => cityState.isEditCityMode,
);

export const slectIsLoadingCity = createSelector(
    selectCitySelector,
    (cityState) => cityState.isLoading,
);

export function generateNewCityItem(mode: ItemMode): IItem<ICity> {
    return {
        mode,
        item: {
            id: 0,
            name: '',
        }
    }
}