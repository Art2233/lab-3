import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { ICitySelector } from './entities/city/selector';
import * as Actions from './actions';
import { IStore } from '../../reducer';

export enum ItemMode {
    View = 'view',
    Edit = 'edit',
}

export interface IItem<T> {
    mode: ItemMode;
    item: T;
}

export interface IRailwayState {
    cityState: ICitySelector;
}

export const railwayState: IRailwayState = {
    cityState: {
        citiesStorage: [],
        cities: [],
        isNewCityMode: false,
        isEditCityMode: false,
    },
};

export const reducer = createReducer(
    railwayState,
    on(Actions.ExtendStateActions, (state, { newSate }) => ({
        ...state,
        ...newSate,
    })),
    on(Actions.ExtendCityStateActions, (state, { cityState }) => ({
        ...state,
        cityState: {
            ...state.cityState,
            ...cityState,
        },
    })),
);

const selectRailwayFeature = createFeatureSelector<IStore, IRailwayState>('railwayPage');

export const selectRailwayState = createSelector(
    selectRailwayFeature,
    (state) => state,
);