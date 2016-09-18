import { Component, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { InforService } from './infor.service';

@Component({
    selector: 'gday-modal',
    templateUrl: 'app/gday.modal.html',
    styleUrls: ['app/gday.modal.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class GdayModal implements AfterViewInit {
    constructor(private inforService: InforService) {
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    getMe() {
        return this.inforService.getInforUser().googleUrl;
    }
}
