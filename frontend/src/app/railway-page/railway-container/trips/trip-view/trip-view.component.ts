import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ITripItem } from '../../../storage/entities/trip/selector';
import { ItemMode } from '../../../storage/reducer';
import { createCopy } from '../../../storage/utils/create-copy';
import { DatePipe } from '@angular/common';
import { IStation } from '../../../../http/station.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ITrip } from '../../../../http/trip.service';
import { ICity } from '../../../../http/city.service';

@Component({
    selector: 'app-trip-view',
    imports: [DatePipe, NgSelectComponent, FormsModule],
    templateUrl: './trip-view.component.html',
    styleUrl: './trip-view.component.scss',
})
export class TripViewComponent implements OnChanges {
    @Input() tripeItem!: ITripItem;
    @Input() statiosStorage: IStation[] = [];
    @Input() citiesStorage: ICity[] = [];

    @Output() onSave = new EventEmitter<{ item: ITrip }>();
    @Output() onClose = new EventEmitter();

    ItemMode = ItemMode;
    tripeItemCopy!: ITripItem;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tripeItem']) {
            this.tripeItemCopy = createCopy(this.tripeItem);
        }
    }

    getCurrentCity(cityId: number): string {
        return this.citiesStorage.find(c => c.id === cityId)?.name || '';
    }

    setDepartureStation(stationId: number) {
        this.tripeItemCopy = {
            ...this.tripeItemCopy,
            item: { ...this.tripeItemCopy.item, departureStationId: stationId }
        };
    }

    setArrivalStation(stationId: number) {
        this.tripeItemCopy = {
            ...this.tripeItemCopy,
            item: { ...this.tripeItemCopy.item, arrivalStationId: stationId }
        };
    }

    get arrivalTimeLocal(): string {

        return this.toInputFormat(this.tripeItemCopy?.item?.arrivalTime);
    }
    set arrivalTimeLocal(value: string) {

        if (!this.tripeItemCopy || !this.tripeItemCopy.item) return;
        this.tripeItemCopy.item.arrivalTime = this.toBackendFormat(value);
    }

    get departureTimeLocal(): string {

        return this.toInputFormat(this.tripeItemCopy?.item?.departureTime);
    }
    set departureTimeLocal(value: string) {

        if (!this.tripeItemCopy || !this.tripeItemCopy.item) return;
        this.tripeItemCopy.item.departureTime = this.toBackendFormat(value);
    }

    private toInputFormat(backend?: string | null): string {
        if (!backend) return '';

        const [date, time] = backend.split(' ');

        if (!date || !time) return '';

        const hhmm = time.split(':').slice(0, 2).join(':');
        return `${date}T${hhmm}`;
    }

    private toBackendFormat(local?: string | null): string {
        if (!local) return '';

        const s = local.replace('T', ' ');
    
        return `${s}:00`;
    }
}
