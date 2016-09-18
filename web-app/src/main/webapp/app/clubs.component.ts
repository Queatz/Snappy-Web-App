import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';

declare var require: any;
var Masonry = require('masonry-layout');

@Component({
    templateUrl: 'app/clubs.component.html',
    styleUrls: ['app/clubs.component.css'],
    providers: [FloatingComponent, ProjectCardComponent]
})
export class ClubsComponent implements AfterViewInit {
    public projects: Array<Object>;
    private inforService: InforService;
    private element: HTMLElement;
    private masonry;

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

    ngAfterViewInit() {
        this.inforService.setPageTitle('Clubs');
    }
}
