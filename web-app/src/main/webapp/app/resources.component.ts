import { Component, ElementRef } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES, OnActivate } from '@angular/router';
import { ProjectCardComponent } from './project-card.component';
import { NewResourceModal } from './new-resource.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/resources.component.html',
    styleUrls: ['app/resources.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class ResourcesComponent implements OnActivate {
    public resources;

    constructor(private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;

        this.newResourceModal = this.inforService.getInforUser() ? NewResourceModal : SigninRequiredModal;

        navigator.geolocation.getCurrentPosition(this.loadNearby.bind(this));
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'resource')
            .subscribe(resources => {
                this.loaded(resources);
            },
            error => {
                this.resources = [];
            });
    }


    private loaded(resources) {
        this.resources = resources;

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
        this.inforService.setPageTitle('Resources');
    }
}
