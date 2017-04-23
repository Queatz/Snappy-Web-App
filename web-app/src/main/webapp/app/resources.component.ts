import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NewResourceModal } from './new-resource.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';

@Component({
    templateUrl: 'app/resources.component.html',
    styleUrls: ['app/resources.component.css'],
})
export class ResourcesComponent implements AfterViewInit {
    public resources;

    private masonry;
    private element;
    private newResourceModal;

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
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Resources');
    }
}
