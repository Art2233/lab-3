import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { ICityState } from './entities/city/selector';
import * as Actions from './actions';
import { IStore } from '../../reducer';
import { IStationSelector } from './entities/station/selector';
import { ITripSelector } from './entities/trip/selector';

export enum ItemMode {
    View = 'view',
    Edit = 'edit',
}

export interface IItem<T> {
    mode: ItemMode;
    item: T;
}

export interface IRailwayState {
    cityState: ICityState;
    stationState: IStationSelector;
    tripState: ITripSelector;
}

export const railwayState: IRailwayState = {
    cityState: {
        citiesStorage: [],
        cities: [],
        isNewCityMode: false,
        isEditCityMode: false,
        isLoading: false,
    },
    stationState: {
        stationsStorage: [],
        stations: [],
        isNewStationMode: false,
        isEditStationMode: false,
        isLoading: false,
    },
    tripState: {
        tripsStorage: [],
        trips: [],
        isNewTripMode: false,
        isEditTripMode: false,
        isLoading: false,
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
    on(Actions.ExtendStationStateActions, (state, { stationState }) => ({
        ...state,
        stationState: {
            ...state.stationState,
            ...stationState,
        },
    })),
    on(Actions.ExtendTripStateActions, (state, { tripState }) => ({
        ...state,
        tripState: {
            ...state.tripState,
            ...tripState,
        },
    })),
);

const selectRailwayFeature = createFeatureSelector<IStore, IRailwayState>('railwayPage');

export const selectRailwayState = createSelector(
    selectRailwayFeature,
    (state) => state,
);