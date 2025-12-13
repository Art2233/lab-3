import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface IStation {
    id: number;
    name: string;
    cityId: number;
}

@Injectable({
    providedIn: 'root',
})
export class StationService {
    constructor(
        private http: HttpClient,
    ) {}

    getList() {
        return this.http.get<IStation[]>('station/get-list');
    }

    create(station: Omit<IStation, 'id'>) {
        return this.http.post<IStation>('station/new', station);
    }

    edit(station: IStation) {
        return this.http.put<IStation>(`station/update/${station.id}`, station);
    }

    delete(stationId: number) {
        return this.http.delete<void>(`station/delete/${stationId}`);
    }
}
