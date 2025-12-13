import { createAction, props } from "@ngrx/store";
import { ItemMode } from "../../reducer";
import { IStation } from "../../../../http/station.service";

export const ToggleNewStationModeAction = createAction(
    "[Station] Toggle New Station Mode",
);

export const ToggleEditStationModeAction = createAction(
    "[Station] Toggle Edit Station Mode",
    props<{ stationId: number; mode: ItemMode }>(),
);

export const SaveStationAction = createAction(
    "[Station] Save Station",
    props<{ item: IStation }>(),
);

export const DeleteStationAction = createAction(
    "[Station] Delete Station",
    props<{ stationId: number }>(),
);