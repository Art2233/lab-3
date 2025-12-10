import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { IStore } from "../../../../reducer";
import { DeleteCityItemAction, SaveCityItemAction, ToggleEditCityModeAction, ToggleNewCityModeAction } from "./actions";
import { map, switchMap, withLatestFrom } from "rxjs";
import { selectCities, selectIsNewCityMode } from "./selector";
import { ExtendCityStateActions } from "../../actions";
import { ItemMode } from "../../reducer";
import { CityService } from "../../../../http/city.service";
import { prepareItems } from "../../utils/prepare";

@Injectable()
export class CityEffects {
    constructor(
        private actions$: Actions,
        private store: Store<IStore>,
        private cityService: CityService,
    ) { }

    changeCityMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleEditCityModeAction),
            withLatestFrom(this.store.select(selectCities)),
            map(([{ cityId, mode }, cities]) => {
                return {
                    cities: cities.map((cityItem) => {
                        return cityItem.item.id === cityId
                            ? {
                                ...cityItem,
                                mode,
                            }
                            : cityItem;
                    }),
                    isEditCityMode: mode === ItemMode.Edit,
                }
            }),
            map((cityState) => ExtendCityStateActions({ cityState }))
        ),
    );

    toggleNewCityMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ToggleNewCityModeAction),
            withLatestFrom(this.store.select(selectIsNewCityMode)),
            map(([_, isNewCityMode]) => ({ isNewCityMode: !isNewCityMode })),
            map((cityState) => ExtendCityStateActions({ cityState }))
        ),
    );

    saveItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SaveCityItemAction),
            withLatestFrom(this.store.select(selectCities)),
            switchMap(([{ item }, cities]) => {
                const request = item.id === 0
                    ? this.cityService.create(item.name)
                    : this.cityService.edit(item);

                return request.pipe(
                    map((newCity) => {
                        const updatedCities = item.id === 0
                            ? [
                                ...cities,
                                ...prepareItems([newCity]),
                            ]
                            : cities.map((cityItem) =>
                                cityItem.item.id === newCity.id
                                    ? {
                                        ...cityItem,
                                        item: newCity,
                                        mode: ItemMode.View,
                                    }
                                    : cityItem
                            );

                        return {
                            cities: updatedCities,
                            isNewCityMode: false,
                            isEditCityMode: false,
                        }
                    }),
                );
            }),
            map((cityState) => ExtendCityStateActions({ cityState }))
        ),
    );

    deleteItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteCityItemAction),
            withLatestFrom(this.store.select(selectCities)),
            switchMap(([{ cityId }, cities]) =>
                this.cityService.delete(cityId).pipe(
                    map(() => {
                        const updatedCities = cities.filter(
                            (cityItem) => cityItem.item.id !== cityId
                        );
                        return {
                            cities: updatedCities,
                        }
                    }),
                )
            ),
            map((cityState) => ExtendCityStateActions({ cityState }))
        )
    );
}