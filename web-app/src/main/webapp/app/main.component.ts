declare var $;

import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';
import { NewOfferModal } from './new-offer.modal';

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnDestroy {
    private inforService;
    private newOfferModal;

    constructor(inforService: InforService, private elementRef: ElementRef, public tutorial: TutorialService) {
        this.inforService = inforService;
        this.newOfferModal = NewOfferModal;
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
