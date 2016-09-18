declare var require;
var Masonry = require('masonry-layout');

import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { FloatingComponent } from './floating.component';
import { PersonCardComponent } from './person-card.component';
import { InviteModal } from './invite.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/people.component.html',
    styleUrls: ['app/people.component.css'],
    directives: [FloatingComponent, PersonCardComponent]
})
export class PeopleComponent implements AfterViewInit {
    public people;
    private element;
    private inviteModal;
    private masonry;

    constructor(private inforService: InforService, element: ElementRef, private api: ApiService) {
        this.element = element.nativeElement;

        this.inviteModal = InviteModal;

        navigator.geolocation.getCurrentPosition(this.loadNearby.bind(this));
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('People');
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'person')
            .subscribe(people => {
                this.loaded(people);
            },
            error => {
                this.people = [];
            });
    }

    private loaded(people) {
        this.people = people;

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
