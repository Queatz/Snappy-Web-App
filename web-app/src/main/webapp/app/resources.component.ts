import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NewResourceModal } from './new-resource.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { WebTitleProvider } from './extra';
import { of } from 'rxjs';

@Component({
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent implements AfterViewInit, WebTitleProvider {
    public resources;

    private element;
    public newResourceModal;

    constructor(private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;

        this.newResourceModal = this.inforService.getInforUser() ? NewResourceModal : SigninRequiredModal;

        this.inforService.getLocation(this.loadNearby.bind(this));
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'resource', ApiService.SELECT_THINGS)
            .subscribe(resources => {
                this.loaded(resources);
            },
            error => {
                this.resources = [];
            });
    }


    private loaded(resources) {
        this.resources = resources;
    }

    ngAfterViewInit() {
    }

    public getWebTitle() {
        return of('Resources');
    }
}
