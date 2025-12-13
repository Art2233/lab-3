import { createAction, props } from "@ngrx/store";
import { ItemMode } from "../../reducer";
import { ITrip } from "../../../../http/trip.service";

export const ToggleNewTripModeAction = createAction(
    "[Trip] Toggle New Trip Mode",
);

export const ToggleEditTripModeAction = createAction(
    "[Trip] Toggle Edit Trip Mode",
    props<{ tripId: number; mode: ItemMode }>(),
);

export const SaveTripAction = createAction(
    "[Trip] Save Trip",
    props<{ item: ITrip }>(),
);

export const DeleteTripAction = createAction(
    "[Trip] Delete Trip",
    props<{ tripId: number }>(),
);