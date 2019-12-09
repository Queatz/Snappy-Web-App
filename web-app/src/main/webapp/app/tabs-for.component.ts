declare var $;
declare var Waves;

import { Component, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'tabs-for',
    templateUrl: './tabs-for.component.html',
    styleUrls: ['./tabs-for.component.css']
})
export class TabsForComponent implements AfterViewInit, OnDestroy {
    @Input() public thing;
    private element;

    constructor(
        element: ElementRef,
        private location: Location
    ) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
        $(this.element).find('.modal').modal();
        $(this.element).find('ul.tabs').tabs({
            onShow: this.changed.bind(this)
        });
    }

    changed(tab) {
        this.location.replaceState([this.thing.googleUrl || this.thing.id, tab.attr('id').substr(4)].join('/'));
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    selectTab(tab: string) {
    }
}
