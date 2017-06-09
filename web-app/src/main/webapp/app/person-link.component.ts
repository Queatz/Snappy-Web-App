declare var $;

import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';

@Component({
    selector: 'person-link',
    templateUrl: './person-link.component.html',
    styleUrls: ['./person-link.component.css']
})
export class PersonLinkComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() person;
    @Input() remove;

    constructor(private elementRef: ElementRef, private api: ApiService) {

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

    getName() {
        if (this.person.firstName) {
            return this.person.firstName + ' ' + this.person.lastName;
        }

        return this.person.name;
    }

    getImageUrl() {
        if (this.person.imageUrl) {
            return this.person.imageUrl;
        }

        return this.api.earthImageUrl(this.person.id, 50);
    }

    goUrl() {
        if (!this.person) {
            return;
        }

        switch (this.person.kind) {
            case 'person':
                return ['/' + this.person.googleUrl];
            default:
                return ['/' + this.person.kind + 's/' + this.person.id];
        }
    }
}