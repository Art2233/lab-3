import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableContainerComponent } from '../../../shared/table-container/table-container.component';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { generateNewTripItem, ITripItem } from '../../storage/entities/trip/selector';
import { ItemMode } from '../../storage/reducer';
import { TripViewComponent } from './trip-view/trip-view.component';
import { IStation } from '../../../http/station.service';
import { ITrip } from '../../../http/trip.service';
import { ICity } from '../../../http/city.service';

@Component({
    selector: 'app-trips',
    imports: [TableContainerComponent, ContextMenuModule, TripViewComponent],
    templateUrl: './trips.component.html',
    styleUrl: './trips.component.scss',
})
export class TripsComponent {
    @Input() isLoading: boolean = false;
    @Input() trips: ITripItem[] = [];
    @Input() isNewTripMode: boolean = false;
    @Input() isEditTripMode: boolean = false;
    @Input() stationsStorage: IStation[] = [];
    @Input() citiesStorage: ICity[] = [];

    @Output() onToggleNewTripMode = new EventEmitter();
    @Output() onToggleEditTripMode = new EventEmitter<{ tripId: number, mode: ItemMode }>();
    @Output() onSaveTrip = new EventEmitter<{ item: ITrip }>();
    @Output() onDeleteTrip = new EventEmitter<{ tripId: number }>();

    ItemMode = ItemMode;
    newTrip = generateNewTripItem(ItemMode.Edit);

    contextMenuItems = [
        {
            label: 'Edit',
            action: (trip: ITripItem) => this.onToggleEditTripMode.emit({ tripId: trip.item.id, mode: ItemMode.Edit }),
            icon: 'fa fa-pencil',
        },
        {
            label: 'Delete',
            action: (trip: ITripItem) => this.onDeleteTrip.emit({ tripId: trip.item.id }),
            icon: 'fa fa-trash',
        }
    ];
}
