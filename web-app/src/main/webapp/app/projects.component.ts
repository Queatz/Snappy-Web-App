import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ProjectCardComponent } from './project-card.component';
import { NewProjectModal } from './new-project.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/projects.component.html',
    styleUrls: ['app/projects.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class ProjectsComponent implements AfterViewInit {
    public projects;

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
            var elem = this.element.querySelector('.grid');
            this.masonry = new Masonry(elem, {
                itemSelector: '.item',
                gutter: 24,
                fitWidth: true
            });
        });
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Projects');
    }
}
