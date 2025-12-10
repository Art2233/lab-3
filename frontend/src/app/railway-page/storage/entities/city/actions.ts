import { createAction, props } from "@ngrx/store";
import { ItemMode } from "../../reducer";
import { ICity } from "../../../../http/city.service";

export const ToggleEditCityModeAction = createAction(
    '[City] Toggle Edit City Mode',
    props<{ cityId: number, mode: ItemMode }>(),
);

export const ToggleNewCityModeAction = createAction(
    '[City] Toggle New City Mode',
);

export const SaveCityItemAction = createAction(
    '[City] Save City Item',
    props<{ item: ICity }>(),
);

export const DeleteCityItemAction = createAction(
    '[City] Delete City Item',
    props<{ cityId: number }>(),
);