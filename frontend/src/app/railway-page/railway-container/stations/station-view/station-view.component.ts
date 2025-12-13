import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { ItemMode } from '../../../storage/reducer';
import { createCopy } from '../../../storage/utils/create-copy';
import { IStationItem } from '../../../storage/entities/station/selector';
import { IStation } from '../../../../http/station.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ICity } from '../../../../http/city.service';

@Component({
    selector: 'app-station-view',
    imports: [CommonModule, FormsModule, NgSelectComponent],
    templateUrl: './station-view.component.html',
    styleUrl: './station-view.component.scss',
})
export class StationViewComponent implements OnChanges {
    private _inputField?: ElementRef<HTMLInputElement>;

    @ViewChild('inputStationField', { static: false })
    set inputField(el: ElementRef<HTMLInputElement> | undefined) {
        this._inputField = el;

        if (el && this.stationItemCopy.mode == ItemMode.Edit) {
            setTimeout(() => el.nativeElement.focus());
        }
    }
    get inputField(): ElementRef<HTMLInputElement> | undefined {
        return this._inputField;
    }

    @Input() stationItem!: IStationItem;
    @Input() citiesStorage: ICity[] = [];

    @Output() onClose = new EventEmitter();
    @Output() onSave = new EventEmitter<{ item: IStation }>();

    ItemMode = ItemMode;

    stationItemCopy!: IStationItem;

    ngOnChanges(): void {
        this.stationItemCopy = createCopy(this.stationItem);
    }

    setCityId(cityId: number) {
        this.stationItemCopy = {
            ...this.stationItemCopy,
            item: { ...this.stationItemCopy.item, cityId }
        };
    }
}
