import { Component, ElementRef } from 'angular2/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { PersonCardComponent } from './person-card.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { ViewName } from './view-name.interface';

@Component({
    templateUrl: 'app/people.component.html',
    styleUrls: ['app/people.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, PersonCardComponent]
})
export class PeopleComponent implements ViewName {
    public people;

    constructor(private inforService: InforService, element: ElementRef, private api: ApiService) {
        this.element = element.nativeElement;

        navigator.geolocation.getCurrentPosition(this.loadNearby.bind(this));
    }

    private loadNearby(position) {
        this.api.peopleHere(position.coords)
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

    getViewName() {
        return 'People';
    }
}
