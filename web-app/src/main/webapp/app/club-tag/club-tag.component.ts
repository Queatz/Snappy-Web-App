declare var $: any;

import { Component, OnInit, AfterViewInit, OnDestroy, Input, ElementRef, HostBinding } from '@angular/core';

@Component({
  selector: 'club-tag',
  templateUrl: './club-tag.component.html',
  styleUrls: ['./club-tag.component.css']
})
export class ClubTagComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() isPublic: boolean;
    @Input() clubs: any;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        if (!this.clubs) {
            this.clubs = [];
        }
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
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
