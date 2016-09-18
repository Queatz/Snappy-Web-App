declare var $;

import { Component, Input, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { InforService } from './infor.service';

@Component({
    selector: 'person-link',
    templateUrl: 'app/person-link.component.html',
    styleUrls: ['app/person-link.component.css']
})
export class PersonLinkComponent implements AfterViewInit, OnDestroy {
    @Input() person;
    @Input() remove;

    constructor(private elementRef: ElementRef) {

    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }

}