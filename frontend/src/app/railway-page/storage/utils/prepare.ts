import { IItem, ItemMode } from "../reducer";

export function prepareItems<T>(items: T[]): IItem<T>[] {
    return items.map(item => ({
        mode: ItemMode.View,
        item,
    }));
}