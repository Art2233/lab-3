import { createAction, props } from "@ngrx/store";
import { IRailwayState } from "./reducer";
import { ICityState } from "./entities/city/selector";
import { IStationSelector } from "./entities/station/selector";
import { ITripSelector } from "./entities/trip/selector";

export const ExtendStateActions = createAction(
    "[Railway Page] Extend State Actions",
    props<{ newSate: Partial<IRailwayState> }>(),
);

export const ExtendCityStateActions = createAction(
    "[Railway Page] Extend City State Actions",
    props<{ cityState: Partial<ICityState> }>(),
);

export const ExtendStationStateActions = createAction(
    "[Railway Page] Extend Station State Actions",
    props<{ stationState: Partial<IStationSelector> }>(),
);

export const ExtendTripStateActions = createAction(
    "[Railway Page] Extend Trip State Actions",
    props<{ tripState: Partial<ITripSelector> }>(),
);


export const InitActions = createAction(
    "[Railway Page] Init Actions",
);
