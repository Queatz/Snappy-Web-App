declare var $;
declare var Waves;

import { Component, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

@Component({
    selector: 'tabs-for',
    templateUrl: 'app/tabs-for.component.html',
    styleUrls: ['app/tabs-for.component.css']
})
export class TabsForComponent implements AfterViewInit, OnDestroy {
    @Input() public thing;

    constructor(
        element: ElementRef
    ) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        $(this.element).find('.modal').modal();
        $(this.element).find('ul.tabs').tabs();
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    selectTab(tab: string) {
        // Masonry
        window.dispatchEvent(new Event('resize'));
    }
}
