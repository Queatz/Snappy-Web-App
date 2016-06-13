import { Component, Input, ElementRef, OnInit, OnChanges, DoCheck } from 'angular2/core';
import { ThingUpdateComponent } from './thing-update.component'

@Component({
    selector: 'thing-updates',
    templateUrl: 'app/thing-updates.component.html',
    styleUrls: ['app/thing-updates.component.css'],
    directives: [ThingUpdateComponent]
})
export class ThingUpdatesComponent implements OnInit, OnChanges {
    private masonry: Masonry;
    @Input() public updates;

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
}
