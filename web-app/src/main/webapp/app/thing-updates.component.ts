import { Component, Input, ElementRef, OnInit } from 'angular2/core';
import { ThingUpdateComponent } from './thing-update.component'

@Component({
    selector: 'thing-updates',
    templateUrl: 'app/thing-updates.component.html',
    styleUrls: ['app/thing-updates.component.css'],
    directives: [ThingUpdateComponent]
})
export class ThingUpdatesComponent implements OnInit {
    private masonry: Masonry;
    @Input() public updates;

    constructor(element: ElementRef) {
        this.element = element.nativeElement;
        this.boundResizeCallback = this.resizeCallback.bind(this);
    }

    ngOnInit() {
        this.loaded(this.updates);
    }

    public loaded(updates) {
        this.updates = _.sortBy(updates, update => -moment(update.date));

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
