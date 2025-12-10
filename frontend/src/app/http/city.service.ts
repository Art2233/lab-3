import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ICity {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class CityService {
    constructor(
        private http: HttpClient,
    ) { }

    getList() {
        return this.http.get<ICity[]>('city/get-list');
    }

    create(name: string) {
        return this.http.post<ICity>('city/new', { name });
    }

    edit(city: ICity) {
        return this.http.put<ICity>(`city/update/${city.id}`, city);
    }

    delete(cityId: number) {
        return this.http.delete<void>(`city/delete/${cityId}`);
    }
}