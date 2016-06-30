import { Component, ElementRef } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES, OnActivate } from '@angular/router';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';

@Component({
    templateUrl: 'app/clubs.component.html',
    styleUrls: ['app/clubs.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class ClubsComponent implements OnActivate {
    public projects;

    constructor(inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.loaded([{}, {}, {}, {}, {}, {}, {}]);
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
        this.inforService.setPageTitle('Clubs');
    }
}
