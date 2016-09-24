import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { OffersComponent } from './offers.component';
import { BannerComponent } from './banner.component';
import { InfoPanelComponent } from './info-panel.component';
import { FloatingComponent } from './floating.component';
import { CueComponent } from './cue.component';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';
import { NewOfferModal } from './new-offer.modal';

@Component({
    templateUrl: 'app/main.component.html',
    styleUrls: ['app/main.component.css'],
    directives: [OffersComponent, BannerComponent, InfoPanelComponent, FloatingComponent, CueComponent]
})
export class MainComponent implements AfterViewInit, OnDestroy {
    constructor(inforService: InforService, private elementRef: ElementRef, public tutorial: TutorialService) {
        this.inforService = inforService;
        this.newOfferModal = NewOfferModal;
    }

    newUser() {
        return !this.inforService.getInforUser();
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Village');
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }
}
