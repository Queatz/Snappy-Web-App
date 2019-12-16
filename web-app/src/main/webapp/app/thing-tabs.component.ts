declare var $: any;
declare var Waves: any;

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
        $(this.element).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
        $(this.element).find('.modal').modal();

    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('close');
    }

    isSignedIn() {
        return this.inforService.getInforUser();
    }
}
