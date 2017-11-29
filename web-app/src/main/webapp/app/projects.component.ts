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

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;

        this.newProjectModal = this.inforService.getInforUser() ? NewProjectModal : SigninRequiredModal;

        this.inforService.getLocation(this.loadNearby.bind(this));
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'project', 'name,about,hidden,photo,in(target(name,photo,imageUrl,firstName,lastName)),clubs(name)')
            .subscribe(projects => {
                this.loaded(projects);
            },
            error => {
                this.projects = [];
            });
    }

    private loaded(projects) {
        this.projects = projects;
    }

    ngAfterViewInit() {
    }

    public getWebTitle() {
        return Observable.of('Projects');
    }
}
