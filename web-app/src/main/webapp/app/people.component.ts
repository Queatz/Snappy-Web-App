import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { InviteModal } from './invite.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';
import { WebTitleProvider } from './extra';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.css'],
})
export class PeopleComponent implements AfterViewInit, WebTitleProvider {
    public people;
    private element;
    public inviteModal;
    private masonry;

    constructor(private inforService: InforService, element: ElementRef, private api: ApiService) {
        this.element = element.nativeElement;

        this.inviteModal = InviteModal;

        this.inforService.getLocation(this.loadNearby.bind(this));
    }

    ngAfterViewInit() {
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

    public getWebTitle() {
        return Observable.of('People');
    }
}
