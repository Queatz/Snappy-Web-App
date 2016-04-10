import { Component, ElementRef } from 'angular2/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES, OnActivate } from 'angular2/router';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { NewHubModal } from './new-hub.modal';

@Component({
    templateUrl: 'app/hubs.component.html',
    styleUrls: ['app/hubs.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class HubsComponent implements OnActivate {
    public hubs;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.newHubModal = NewHubModal;

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

    routerOnActivate() {
        this.inforService.setPageTitle('Hubs');
    }
}
