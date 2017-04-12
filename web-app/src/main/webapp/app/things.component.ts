declare var require: any;
declare var _: any;
var Masonry = require('masonry-layout');

import { Component, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'things',
    templateUrl: 'app/things.component.html',
    styleUrls: ['app/things.component.css'],
})
export class ThingsComponent implements AfterViewInit, OnDestroy {
    @Input() public things;
    private element: HTMLElement;
    private masonry;
    private mutationObserver;
    private boundRemoveCallback;

    constructor(private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
        this.boundRemoveCallback = this.removed.bind(this);
    }

    ngAfterViewInit() {
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

        setTimeout(() => {
            var elem = this.element.querySelector('.grid');
            this.masonry = new Masonry(elem, {
                itemSelector: '.item',
                gutter: 24,
                fitWidth: true
            });
        });
    }

    removed(thing) {
        _.remove(this.things, t => t.source.id === thing.id);
    }

    ngOnDestroy() {
        this.mutationObserver.disconnect();
    }
}
