import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ExtendCityStateActions, InitActions } from "./actions";
import { concat, map, switchMap } from "rxjs";
import { CityService } from "../../http/city.service";
import { prepareItems } from "./utils/prepare";

@Injectable({
    providedIn: 'root',
})
export class MainEffects {
    constructor(
        private actions$: Actions,
        private cityService: CityService,
    ) {}

    init$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InitActions),
            switchMap(() => {
                const cities$ = this.cityService.getList().pipe(
                    map((cities) => ExtendCityStateActions({
                        cityState: { 
                            citiesStorage: cities,
                            cities: prepareItems(cities),
                        }
                    })),
                );

                return concat(cities$);
            })
        ),
    );
}