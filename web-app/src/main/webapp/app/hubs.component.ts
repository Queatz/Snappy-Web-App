import { Component, ElementRef } from 'angular2/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';
import { ViewName } from './view-name.interface';

@Component({
    templateUrl: 'app/hubs.component.html',
    styleUrls: ['app/hubs.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class HubsComponent implements ViewName {
    public projects;

    constructor(inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.loaded([{}, {}, {}]);
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

    getViewName() {
        return 'Hubs';
    }
}
