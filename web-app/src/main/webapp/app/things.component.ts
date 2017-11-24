declare var _: any;

import { Component, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';

@Component({
    selector: 'things',
    templateUrl: './things.component.html',
    styleUrls: ['./things.component.css'],
})
export class ThingsComponent implements AfterViewInit, OnDestroy {
    @Input() public things;
    private element: HTMLElement;
    private boundRemoveCallback;

    constructor(private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
        this.boundRemoveCallback = this.removed.bind(this);
    }

    ngAfterViewInit() {
        var self = this;

        var config = { childList: true };
    }

    removed(thing) {
        _.remove(this.things, t => t.source.id === thing.id);
    }

    ngOnDestroy() {
    }
}
