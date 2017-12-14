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
    public modal;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.modal = NewClubModalComponent;
    }

    ngOnInit() {
        this.api.clubs(ApiService.SELECT_CLUBS)
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
    }

    ngAfterViewInit() {
    }

    public getWebTitle() {
        return Observable.of('Clubs');
    }
}
