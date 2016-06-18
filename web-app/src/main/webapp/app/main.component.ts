import { Component, AfterViewInit, OnDestroy } from 'angular2/core';
import { OnActivate } from 'angular2/router';
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
export class MainComponent implements OnActivate, AfterViewInit, OnDestroy {
    constructor(inforService: InforService) {
        this.inforService = inforService;
        this.newOfferModal = NewOfferModal;
    }

    newUser() {
        return !this.inforService.getInforUser();
    }

    routerOnActivate() {
        this.inforService.setPageTitle('Village');
    }

    ngAfterViewInit() {
        $('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }
}
