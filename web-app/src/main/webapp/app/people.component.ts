import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { InviteModal } from './invite.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';

@Component({
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.css'],
})
export class PeopleComponent implements AfterViewInit {
    public people;
    private element;
    public inviteModal;
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
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }
}
