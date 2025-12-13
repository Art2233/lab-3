import { CityEffects } from "./entities/city/city.effects";
import { StationEffects } from "./entities/station/station.effects";
import { TripEffects } from "./entities/trip/trip.effects";
import { MainEffects } from "./main.effects";

export const railwayPageEffects = [
    MainEffects,
    CityEffects,
    StationEffects,
    TripEffects,
];