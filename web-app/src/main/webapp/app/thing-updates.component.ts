declare var require: any;
var Masonry = require('masonry-layout');

import { Component, Input, ElementRef, OnInit, OnChanges, DoCheck, OnDestroy } from '@angular/core';

@Component({
    selector: 'thing-updates',
    templateUrl: 'app/thing-updates.component.html',
    styleUrls: ['app/thing-updates.component.css'],
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
            console.log(mutations);
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
            var elem = this.element.querySelector('.grid');
            this.masonry = new Masonry(elem, {
                itemSelector: '.item',
                gutter: 24,
                fitWidth: true
            });
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
