import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableContainerComponent } from '../../../shared/table-container/table-container.component';
import { generateNewStationItem, IStationItem } from '../../storage/entities/station/selector';
import { StationViewComponent } from './station-view/station-view.component';
import { ICity } from '../../../http/city.service';
import { ItemMode } from '../../storage/reducer';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { IStation } from '../../../http/station.service';

@Component({
    selector: 'app-stations',
    imports: [TableContainerComponent, StationViewComponent, ContextMenuModule],
    templateUrl: './stations.component.html',
    styleUrl: './stations.component.scss',
})
export class StationsComponent {
    @Input() stations: IStationItem[] = [];
    @Input() citiesStorage: ICity[] = [];
    @Input() isNewStationMode: boolean = false;
    @Input() isEditStationMode: boolean = false
    @Input() isLoading: boolean = false;

    @Output() onSaveStation = new EventEmitter<{ item: IStation }>();
    @Output() onToggleNewStationMode = new EventEmitter();
    @Output() onToggleEditStationMode = new EventEmitter<{ stationId: number, mode: ItemMode }>();
    @Output() onDeleteStation = new EventEmitter<{ stationId: number }>();

    newStation = generateNewStationItem(ItemMode.Edit);
    ItemMode = ItemMode;

    contextMenuItems = [
        {
            label: 'Edit',
            action: (station: IStationItem) => this.onToggleEditStationMode.emit({ stationId: station.item.id, mode: ItemMode.Edit }),
            icon: 'fa fa-pencil',
        },
        {
            label: 'Delete',
            action: (station: IStationItem) => this.onDeleteStation.emit({ stationId: station.item.id }),
            icon: 'fa fa-trash',
        }
    ];
}
