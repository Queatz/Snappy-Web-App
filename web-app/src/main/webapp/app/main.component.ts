import { Component, AfterViewInit } from 'angular2/core';
import { OffersComponent } from './offers.component';
import { BannerComponent } from './banner.component';
import { InfoPanelComponent } from './info-panel.component';
import { FloatingComponent } from './floating.component';

import {InforService} from './infor.service';

@Component({
    templateUrl: 'app/main.component.html',
    styleUrls: ['app/main.component.css'],
    directives: [OffersComponent, BannerComponent, InfoPanelComponent, FloatingComponent]
})
export class MainComponent implements AfterViewInit {
    constructor(inforService: InforService) {
        this.inforService = inforService;
    }

    ngAfterViewInit() {
        if (this.inforService.getModalTrigger()) {
            $(this.element).find('.modal-trigger-floating').leanModal();
        }
    }
}
