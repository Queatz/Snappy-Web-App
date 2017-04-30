import {Component, AfterViewInit, ElementRef} from '@angular/core';

@Component({
	selector: 'banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements AfterViewInit {
    private element: HTMLElement;
    private beginTime: number;

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement.children[0];
    }

    ngAfterViewInit() {
        this.beginTime = new Date().getTime();
        //this.loop();
    }

    loop() {
        var p = 100 - Math.max(0, Math.min(100, (new Date().getTime() - this.beginTime) / 500));

        this.element.style.backgroundPositionY = p + '%';

        if (p > 0) {
            setTimeout(() => { this.loop(); }, 10);
        }
    }
}
