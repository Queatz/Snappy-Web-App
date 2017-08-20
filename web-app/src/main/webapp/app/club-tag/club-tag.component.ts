declare var $: any;

import { Component, OnInit, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'club-tag',
  templateUrl: './club-tag.component.html',
  styleUrls: ['./club-tag.component.css']
})
export class ClubTagComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() name: string;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }
}
