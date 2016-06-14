import { Component, ElementRef, Input, AfterViewInit } from 'angular2/core';
import { InforService } from './infor.service';

@Component({
    selector: 'invite-modal',
    templateUrl: 'app/invite.modal.html',
    styleUrls: ['app/invite.modal.css']
})
export class InviteModal implements AfterViewInit {
    constructor(private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }
}
