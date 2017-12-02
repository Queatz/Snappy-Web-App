declare var $;

import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef, ComponentRef } from '@angular/core';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';
import { NewOfferModal } from './new-offer.modal';
import { ApiService } from './api.service';

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnInit, OnDestroy {
    private inforService;
    private newOfferModal;
    private people;

    constructor(private api: ApiService, inforService: InforService, private elementRef: ElementRef, public tutorial: TutorialService) {
        this.inforService = inforService;
        this.newOfferModal = NewOfferModal;
    }

    ngOnInit() {
        this.inforService.getLocation(position => {
            this.api.earthHere(position.coords, 'person', 'name,firstName,lastName,imageUrl,googleUrl,around,infoDistance')
                .subscribe(people => this.people = people.sort(p => p.infoDistance));
        });
    }

    onModalOpened(modal: ComponentRef<any>) {
        (modal.instance as NewOfferModal).asMemberOf = this.inforService.getInforUser();
    }

    newUser() {
        return !this.inforService.getInforUser();
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }
}
