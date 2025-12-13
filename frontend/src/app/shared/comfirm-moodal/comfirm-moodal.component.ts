import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-comfirm-moodal',
    imports: [],
    templateUrl: './comfirm-moodal.component.html',
    styleUrl: './comfirm-moodal.component.scss',
})
export class ComfirmMoodalComponent {
    @Input() prompt!: string;

    constructor(public modal: NgbActiveModal) {}
}
