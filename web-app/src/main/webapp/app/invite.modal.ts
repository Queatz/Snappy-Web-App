declare var $;
declare var Waves;

import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
    selector: 'invite-modal',
    templateUrl: './invite.modal.html',
    styleUrls: ['./invite.modal.css']
})
export class InviteModal implements AfterViewInit {

    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit() {
        Waves.displayEffect();
       $(this.elementRef.nativeElement.querySelector('.modal')).modal();
    }
}
