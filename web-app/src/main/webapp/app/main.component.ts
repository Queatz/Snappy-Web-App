import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { OffersComponent } from './offers.component';
import { BannerComponent } from './banner.component';
import { InfoPanelComponent } from './info-panel.component';
import { FloatingComponent } from './floating.component';
import { InforService } from './infor.service';
import { NewOfferModal } from './new-offer.modal';

@Component({
    templateUrl: 'app/main.component.html',
    styleUrls: ['app/main.component.css'],
    directives: [OffersComponent, BannerComponent, InfoPanelComponent, FloatingComponent]
})
export class MainComponent implements AfterViewInit, OnDestroy {
    constructor(inforService: InforService) {
        this.inforService = inforService;
        this.newOfferModal = NewOfferModal;
    }

    newUser() {
        return !this.inforService.getInforUser();
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Village');
        $('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }
}
