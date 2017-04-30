declare var $;
declare var Waves;

import { Component, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { InforService } from './infor.service';

@Component({
    selector: 'thing-tabs',
    templateUrl: './thing-tabs.component.html',
    styleUrls: ['./thing-tabs.component.css']
})
export class ThingTabsComponent implements AfterViewInit, OnDestroy {
    @Input() public thing;

    private element;

    constructor(
        private inforService: InforService,
        element: ElementRef
    ) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        $(this.element).find('.modal').modal();

    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    isSignedIn() {
        return this.inforService.getInforUser();
    }

    isMyProfile() {
        return this.inforService.getInforUser() &&
            this.inforService.getInforUser().id === this.thing.id;
    }
}
