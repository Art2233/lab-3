import { createAction, props } from "@ngrx/store";
import { IRailwayState } from "./reducer";
import { ICitySelector } from "./entities/city/selector";

export const ExtendStateActions = createAction(
    "[Railway Page] Extend State Actions",
    props<{ newSate: Partial<IRailwayState> }>(),
);

export const ExtendCityStateActions = createAction(
    "[Railway Page] Extend City State Actions",
    props<{ cityState: Partial<ICitySelector> }>(),
);

export const InitActions = createAction(
    "[Railway Page] Init Actions",
);