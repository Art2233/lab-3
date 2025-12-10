import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { IItem, ItemMode } from '../../../storage/reducer';
import { ICity } from '../../../../http/city.service';
import { FormsModule } from '@angular/forms';
import { createCopy } from '../../../storage/utils/create-copy';

@Component({
    selector: 'app-city-view',
    imports: [FormsModule],
    templateUrl: './city-view.component.html',
    styleUrl: './city-view.component.scss',
})
export class CityViewComponent implements OnChanges {
    private _inputField?: ElementRef<HTMLInputElement>;

    @ViewChild('inputField', { static: false })
    set inputField(el: ElementRef<HTMLInputElement> | undefined) {
        this._inputField = el;

        if (el && this.cityItemCopy.mode === ItemMode.Edit) {
            setTimeout(() => el.nativeElement.focus());
        }
    }
    get inputField(): ElementRef<HTMLInputElement> | undefined {
        return this._inputField;
    }

    @Input() cityItem!: IItem<ICity>;

    @Output() onClose = new EventEmitter();
    @Output() onSaveCity = new EventEmitter<{ item: ICity }>();

    ItemMode = ItemMode;

    cityItemCopy!: IItem<ICity>;

    ngOnChanges(): void {
        this.cityItemCopy = createCopy(this.cityItem);
    }
}
