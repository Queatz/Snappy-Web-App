import { Component, ElementRef } from 'angular2/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES, OnActivate } from 'angular2/router';
import { ProjectCardComponent } from './project-card.component';
import { NewProjectModal } from './new-project.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/projects.component.html',
    styleUrls: ['app/projects.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class ProjectsComponent implements OnActivate {
    public projects;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;

        this.newProjectModal = NewProjectModal;

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

    routerOnActivate() {
        this.inforService.setPageTitle('Projects');
    }
}
