import { Component } from 'angular2/core';
import { OffersComponent } from './offers.component';
import { BannerComponent } from './banner.component';

@Component({
	templateUrl: 'app/main.component.html',
	styleUrls: ['app/main.component.css'],
	directives: [OffersComponent, BannerComponent]
})
export class MainComponent { }
