import { Component, AfterViewInit } from 'angular2/core';
import { OffersComponent } from './offers.component';
import { BannerComponent } from './banner.component';
import { InfoPanelComponent } from './info-panel.component';
import { FloatingComponent } from './floating.component';

var checkFirst = true;

@Component({
	templateUrl: 'app/main.component.html',
	styleUrls: ['app/main.component.css'],
	directives: [OffersComponent, BannerComponent, InfoPanelComponent, FloatingComponent]
})
export class MainComponent implements AfterViewInit {
	ngAfterViewInit() {
  		if (checkFirst) {
  			checkFirst = false;
			$('.modal-trigger-thientt').leanModal();
		}    	
    }
}
