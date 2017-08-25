import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';
import { WebTitleProvider } from './extra';
import { Observable } from 'rxjs';
import { NewClubModalComponent } from './new-club-modal/new-club-modal.component';

@Component({
    templateUrl: './clubs.component.html',
    styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements AfterViewInit, WebTitleProvider {
    public clubs: Array<Object>;
    private element: HTMLElement;
    private masonry;
    private modal;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.modal = NewClubModalComponent;
    }

    ngOnInit() {
        this.api.clubs()
            .subscribe(clubs => {
                this.loaded(clubs);
            },
            error => {
                this.clubs = [];
            });
    }

    private loaded(clubs) {
        // Yes, this is a hack
        clubs.forEach(club => {
            let source = club.source;
            club.source = club.target;
            club.target = source;
        });

        this.clubs = clubs;

        setTimeout(() => {
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    ngAfterViewInit() {
    }

    public getWebTitle() {
        return Observable.of('Clubs');
    }
}
