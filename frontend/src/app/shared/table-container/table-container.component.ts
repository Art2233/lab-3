import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    selector: 'app-table-container',
    imports: [CommonModule, LoadingComponent],
    templateUrl: './table-container.component.html',
    styleUrl: './table-container.component.scss',
})
export class TableContainerComponent {
    @ContentChild('content') contentTemplate!: TemplateRef<any>;
    @ContentChild('button') buttonTemplate!: TemplateRef<any>;

    @Input() isLoading = false;
}
