declare var require: any;
var Masonry = require('masonry-layout');

import { Component, ElementRef, AfterViewInit, Input } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'things',
    templateUrl: 'app/things.component.html',
    styleUrls: ['app/things.component.css'],
    providers: [ProjectCardComponent]
})
export class ThingsComponent implements AfterViewInit {
    @Input() public things;
    private element: HTMLElement;
    private masonry;

    constructor(private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            var elem = this.element.querySelector('.grid');
            this.masonry = new Masonry(elem, {
                itemSelector: '.item',
                gutter: 24,
                fitWidth: true
            });
        });
    }
}
