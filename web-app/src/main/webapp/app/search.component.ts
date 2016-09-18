declare var require;
var Masonry = require('masonry-layout');

import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';

@Component({
    templateUrl: 'app/search.component.html',
    styleUrls: ['app/search.component.css'],
    directives: [FloatingComponent, ProjectCardComponent]
})
export class SearchComponent implements AfterViewInit {
    public projects;

    private masonry;
    private inforService;
    private element;

    constructor(inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.loaded([{}, {}]);
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
        this.inforService.setPageTitle('Search');
    }
}
