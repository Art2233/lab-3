export function createCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}