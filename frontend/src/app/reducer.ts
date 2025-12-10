import { IRailwayState, reducer as railwayReducer } from "./railway-page/storage/reducer";

export interface IStore {
    railwayPage: IRailwayState;
}

export const reducers = {
    railwayPage: railwayReducer,
};