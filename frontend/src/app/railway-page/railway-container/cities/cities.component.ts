import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IItem, ItemMode } from '../../storage/reducer';
import { ICity } from '../../../http/city.service';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { CityViewComponent } from './city-view/city-view.component';
import { generateNewCityItem } from '../../storage/entities/city/selector';

@Component({
    selector: 'app-cities',
    imports: [ContextMenuModule, CityViewComponent],
    templateUrl: './cities.component.html',
    styleUrl: './cities.component.scss',
})
export class CitiesComponent {
    @Input() cities: IItem<ICity>[] = [];
    @Input() isNewCityMode: boolean = false;
    @Input() isEditCityMode: boolean = false;

    @Output() onToggleCityEditMode = new EventEmitter<{ cityId: number, mode: ItemMode }>();
    @Output() onToggleNewCityMode = new EventEmitter();

    @Output() onSaveCity = new EventEmitter<{ item: ICity }>();
    @Output() onDeleteCity = new EventEmitter<{ cityId: number }>();

    newCity = generateNewCityItem(ItemMode.Edit);
    ItemMode = ItemMode;

    contextMenuItems = [
        {
            label: 'Edit',
            action: (city: IItem<ICity>) => this.onToggleCityEditMode.emit({ cityId: city.item.id, mode: ItemMode.Edit }),
            icon: 'fa fa-pencil',
        },
        {
            label: 'Delete',
            action: (city: IItem<ICity>) => this.onDeleteCity.emit({ cityId: city.item.id }),
            icon: 'fa fa-trash',
        }
    ]
}
