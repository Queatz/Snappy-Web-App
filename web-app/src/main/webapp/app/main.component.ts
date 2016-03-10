import { Component } from 'angular2/core';
import { OffersComponent } from './offers.component';
import { BannerComponent } from './banner.component';
import { InfoPanelComponent } from './info-panel.component';

@Component({
	templateUrl: 'app/main.component.html',
	styleUrls: ['app/main.component.css'],
	directives: [OffersComponent, BannerComponent, InfoPanelComponent]
})
export class MainComponent { }
