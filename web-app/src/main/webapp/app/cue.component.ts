import { Component, ElementRef, OnChanges, Input, AfterViewInit } from '@angular/core';

@Component({
    selector: 'cue',
    templateUrl: 'app/cue.component.html',
    styleUrls: ['app/cue.component.css']
})
export class CueComponent implements OnChanges, AfterViewInit {
    @Input() show: boolean;
    @Input() align: string;

    private visibilityTimeout;

    constructor(private elementRef: ElementRef) {

    }

    ngAfterViewInit() {
    }

    ngOnChanges(changes) {
        if (changes.show) {
            this.setup();
        }

        if (changes.align) {
            if (!changes.align.isFirstChange()) {
                $(this.elementRef.nativeElement).removeClass('align-' + changes.align.previousValue);
            }

            if (changes.align.currentValue) {
                $(this.elementRef.nativeElement).addClass('align-' + changes.align.currentValue);
            }
        }
    }

    setup() {
        if (this.visibilityTimeout) {
            clearTimeout(this.visibilityTimeout);
        }

        if (this.show) {
            $(this.elementRef.nativeElement).show();
            this.visibilityTimeout = setTimeout(() => $(this.elementRef.nativeElement).addClass('visible'));
        } else {
            $(this.elementRef.nativeElement).removeClass('visible');
            this.visibilityTimeout = setTimeout(() => $(this.elementRef.nativeElement).hide(), 1000);
        }
    }
}
