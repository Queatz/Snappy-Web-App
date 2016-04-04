import { Component, ElementRef } from 'angular2/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES, OnActivate } from 'angular2/router';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';
import { NewHubModal } from './new-hub.modal';

@Component({
    templateUrl: 'app/hubs.component.html',
    styleUrls: ['app/hubs.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class HubsComponent implements OnActivate {
    public projects;

    constructor(inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.loaded([{}, {}, {}]);
        this.newHubModal = NewHubModal;
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
        this.inforService.setPageTitle('Hubs');
    }
}
