import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import util from './util';

@Component({
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
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
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    ngAfterViewInit() {
    }
}
