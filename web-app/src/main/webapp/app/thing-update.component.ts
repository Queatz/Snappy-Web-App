import { Component, View, Input, AfterViewInit, ElementRef, OnDestroy } from 'angular2/core';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { ApiService } from './api.service';

var checkFirst = true;

@Component({
    selector: 'thing-update',
    templateUrl: 'app/thing-update.component.html',
    styleUrls: ['app/thing-update.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ThingUpdateComponent implements AfterViewInit, OnDestroy {
    @Input() public update;
    @Input() public resizeCallback;

    constructor(private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
      	$('.tooltipped').tooltip({delay: 50});
        this.updateImage = this.api.earthImageUrl(this.update.id);
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }

    public loaded() {
        this.resizeCallback();
    }

    public time() {
        return moment(this.update.date).fromNow();
    }
}
