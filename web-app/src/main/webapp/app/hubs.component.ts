declare var _: any;

import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { NewHubModal } from './new-hub.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { WebTitleProvider } from './extra';
import { of } from 'rxjs';

@Component({
    templateUrl: './hubs.component.html',
    styleUrls: ['./hubs.component.css'],
})
export class HubsComponent implements AfterViewInit, WebTitleProvider {
    public hubs;

    private element;
    public newHubModal;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.newHubModal = this.inforService.getInforUser() ? NewHubModal : SigninRequiredModal;

        this.inforService.getLocation(this.loadNearby.bind(this));
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'hub', ApiService.SELECT_THINGS)
            .subscribe(hubs => {
                this.loaded(hubs);
            },
            error => {
                this.hubs = [];
            });
    }

    private loaded(hubs) {
        this.hubs = _.sortBy(hubs, h => h.infoDistance);
    }

    ngAfterViewInit() {
    }

    public getWebTitle() {
        return of('Hubs');
    }
}
