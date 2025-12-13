import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComfirmMoodalComponent } from './comfirm-moodal.component';

@Injectable({
    providedIn: 'root',
})
export class ComfirmMoodalService {
    constructor(
        private modal: NgbModal,
    ) { }

    open(prompt: string) {
        const ref = this.modal.open(ComfirmMoodalComponent, {
            size: 'md',
        });

        ref.componentInstance.prompt = prompt;

        return ref.result;
    }
}
