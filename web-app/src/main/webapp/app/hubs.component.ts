declare var require;
var Masonry = require('masonry-layout');

import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { NewHubModal } from './new-hub.modal';
import { SigninRequiredModal } from './signin-required.modal';

@Component({
    templateUrl: 'app/hubs.component.html',
    styleUrls: ['app/hubs.component.css'],
    directives: [FloatingComponent, ProjectCardComponent]
})
export class HubsComponent implements AfterViewInit {
    public hubs;

    private element;
    private newHubModal;
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
            var elem = this.element.querySelector('.grid');
            this.masonry = new Masonry(elem, {
                itemSelector: '.item',
                gutter: 24,
                fitWidth: true
            });
        });
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Hubs');
    }
}
