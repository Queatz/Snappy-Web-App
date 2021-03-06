declare var $: any;

import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef, HostBinding } from '@angular/core';
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

    constructor(private elementRef: ElementRef, private api: ApiService) {}

    ngOnInit() {
        if (this.person) {
            if (this.person.kind === 'member') {
                this.person = this.person.source;
            }
        }
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('close');
    }

    @HostBinding('style.display')
    get visible() {
        if (!this.person) {
            return 'none';
        }

        return 'inline-block';
    }

    getName(full: boolean = false) {
        if (!this.person) {
            return;
        }

        if (this.person.firstName) {
            return this.person.firstName + (full ? ' ' + this.person.lastName : '');
        }

        return this.person.name;
    }

    getImageUrl() {
        if (!this.person) {
            return;
        }

        if (this.person.imageUrl) {
            return this.person.imageUrl;
        }

        if (this.person.photo) {
            return this.api.earthImageUrl(this.person.id, 50);
        } else {
            return 'img/night.png';
        }
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

    public presence() {
        return util.presence(this.person);
    }
}