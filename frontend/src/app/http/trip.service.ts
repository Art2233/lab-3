import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ITrip {
    id: number;
    departureStationId: number;
    arrivalStationId: number;
    trainNumber: string;
    departureTime: string;
    arrivalTime: string;
}

@Injectable({
    providedIn: 'root',
})
export class TripService {
    constructor(
        private http: HttpClient,
    ) {}

    getList() {
        return this.http.get<ITrip[]>('trip/get-list');
    }

    create(trip: Omit<ITrip, 'id'>) {
        return this.http.post<ITrip>('trip/new', trip);
    }

    edit(trip: ITrip) {
        return this.http.put<ITrip>(`trip/update/${trip.id}`, trip);
    }

    delete(tripId: number) {
        return this.http.delete<void>(`trip/delete/${tripId}`);
    }
}
