declare var Waves;

import { Component, AfterViewInit } from '@angular/core';

@Component({
    selector: 'invite-modal',
    templateUrl: 'app/invite.modal.html',
    styleUrls: ['app/invite.modal.css']
})
export class InviteModal implements AfterViewInit {
    ngAfterViewInit() {
        Waves.displayEffect();
    }
}
