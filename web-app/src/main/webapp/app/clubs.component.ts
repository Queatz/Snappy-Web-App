import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import util from './util';
import { WebTitleProvider } from './extra';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './clubs.component.html',
    styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements AfterViewInit, WebTitleProvider {
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
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Clubs');
    }

    public getWebTitle() {
        return Observable.of('Clubs');
    }
}
