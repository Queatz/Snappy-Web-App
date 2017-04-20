declare var $;

import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { InforService } from './infor.service';

@Component({
    selector: 'person-link',
    templateUrl: 'app/person-link.component.html',
    styleUrls: ['app/person-link.component.css']
})
export class PersonLinkComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() person;
    @Input() remove;

    constructor(private elementRef: ElementRef) {

    }

    ngOnInit() {
        if (this.person.kind === 'member') {
            this.person = this.person.source;
        }
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }

}