import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NewProjectModal } from './new-project.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';
import { WebTitleProvider } from './extra';
import { Observable, Subject } from 'rxjs';

@Component({
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements AfterViewInit, WebTitleProvider {
    public projects;
    public newProjectModal;
    private element;
    private masonry;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;

        this.newProjectModal = this.inforService.getInforUser() ? NewProjectModal : SigninRequiredModal;

        navigator.geolocation.getCurrentPosition(this.loadNearby.bind(this));
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'project')
            .subscribe(projects => {
                this.loaded(projects);
            },
            error => {
                this.projects = [];
            });
    }

    private loaded(projects) {
        this.projects = projects;

        setTimeout(() => {
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Projects');
    }

    public getWebTitle() {
        return Observable.of('Projects');
    }
}
