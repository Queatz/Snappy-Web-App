declare var $: any;

import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges, Input, ElementRef, HostBinding, SimpleChanges } from '@angular/core';

@Component({
  selector: 'club-tag',
  templateUrl: './club-tag.component.html',
  styleUrls: ['./club-tag.component.css']
})
export class ClubTagComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @Input() isPublic: boolean;
    @Input() clubs: any;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        if (!this.clubs) {
            this.clubs = [];
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.clubs) {
            this.clubs = [];
        }
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('close');
    }

    @HostBinding('class.is-public')
    get classIsPublic() {
        return this.isPublic;
    }

    @HostBinding('style.display')
    get visible() {
        return this.clubs && this.clubs.length ? 'block' : 'none';
    }
}
