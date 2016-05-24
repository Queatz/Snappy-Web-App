import { Component, View, Input, AfterViewInit, ElementRef} from 'angular2/core';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { ApiService } from './api.service';

var checkFirst = true;

@Component({
    selector: 'thing-update',
    templateUrl: 'app/thing-update.component.html',
    styleUrls: ['app/thing-update.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ThingUpdateComponent implements AfterViewInit {
    @Input() public update;
    @Input() public resizeCallback;

    constructor(private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        this.updateImage = this.api.earthImageUrl(this.update.id);
    }

    public loaded() {
        this.resizeCallback();
    }

    public time() {
        return moment(this.update.date).fromNow();
    }
}
