declare var _: any;

import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { InviteModal } from './invite.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { WebTitleProvider } from './extra';
import { of } from 'rxjs';

@Component({
    selector: 'people-list',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.css'],
})
export class PeopleComponent implements AfterViewInit, WebTitleProvider {
    public people;
    private element;
    public inviteModal;

    constructor(private inforService: InforService, element: ElementRef, private api: ApiService) {
        this.element = element.nativeElement;

        this.inviteModal = InviteModal;

        this.inforService.getLocation(this.loadNearby.bind(this));
    }

    ngAfterViewInit() {
    }

    private loadNearby(position) {
        this.api.earthHere(position.coords, 'person', ApiService.SELECT_PEOPLE)
            .subscribe(people => {
                this.loaded(people);
            },
            error => {
                this.people = [];
            });
    }

    private loaded(people) {
        this.people = _.sortBy(people, p => p.infoDistance);
    }

    public getWebTitle() {
        return of('People');
    }
}
