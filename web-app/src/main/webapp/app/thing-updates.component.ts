import { Component, Input, ElementRef, OnInit, OnChanges, DoCheck, OnDestroy } from '@angular/core';
import util from './util';

@Component({
    selector: 'thing-updates',
    templateUrl: './thing-updates.component.html',
    styleUrls: ['./thing-updates.component.css'],
})
export class ThingUpdatesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public updates;

    private element: HTMLElement;
    private boundResizeCallback;
    private previousArraySize;

    constructor(element: ElementRef) {
        this.element = element.nativeElement;
        this.boundResizeCallback = this.resizeCallback.bind(this);
    }

    ngDoCheck() {
        if(this.previousArraySize !== this.updates.length) {
            this.loaded(this.updates);
        }
    }

    ngOnInit() {
        this.loaded(this.updates);
        var self = this;

        var config = { childList: true };

    }

    ngOnChanges() {
        this.loaded(this.updates);
    }

    public loaded(updates) {
        this.previousArraySize = updates.length;
    }

    resizeCallback() {
    }

    ngOnDestroy() {
    }
}
