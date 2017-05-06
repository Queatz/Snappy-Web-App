import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { NewHubModal } from './new-hub.modal';
import { SigninRequiredModal } from './signin-required.modal';
import util from './util';
import { WebTitleProvider } from './extra';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './hubs.component.html',
    styleUrls: ['./hubs.component.css'],
})
export class HubsComponent implements AfterViewInit, WebTitleProvider {
    public hubs;

    private element;
    public newHubModal;
    private masonry;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.newHubModal = this.inforService.getInforUser() ? NewHubModal : SigninRequiredModal;

        navigator.geolocation.getCurrentPosition(this.loadNearby.bind(this));
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'hub')
            .subscribe(hubs => {
                this.loaded(hubs);
            },
            error => {
                this.hubs = [];
            });
    }

    private loaded(hubs) {
        this.hubs = hubs;

        setTimeout(() => {
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Hubs');
    }

    public getWebTitle() {
        return Observable.of('Hubs');
    }
}
