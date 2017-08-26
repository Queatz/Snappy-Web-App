import { Component, Input, ElementRef, OnInit, OnChanges, DoCheck, OnDestroy } from '@angular/core';
import util from './util';

@Component({
    selector: 'thing-updates',
    templateUrl: './thing-updates.component.html',
    styleUrls: ['./thing-updates.component.css'],
})
export class ThingUpdatesComponent implements OnInit, OnChanges, OnDestroy {
    private masonry;
    private mutationObserver;
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

        this.mutationObserver = new MutationObserver((mutations) => {
          if (self.masonry) {
            setTimeout(() => {
                self.masonry.reloadItems();
                self.masonry.layout();
            }, 100);
          }
        });

        var config = { childList: true };
        this.mutationObserver.observe(this.element.querySelector('.grid'), config);

    }

    ngOnChanges() {
        this.loaded(this.updates);
    }

    public loaded(updates) {
        this.previousArraySize = updates.length;

        setTimeout(() => {
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    resizeCallback() {
        setTimeout(() => {
            if (this.masonry) {
                this.masonry.layout();
            }
        }, 100);
    }

    ngOnDestroy() {
        this.mutationObserver.disconnect();
    }
}
