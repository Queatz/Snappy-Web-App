import {Component, AfterViewInit, ElementRef} from 'angular2/core';
import {SigninComponent} from './signin.component'

@Component({
	selector: 'banner',
	templateUrl: 'app/banner.component.html',
	styleUrls: ['app/banner.component.css'],
	directives: [SigninComponent]
})
export class BannerComponent implements AfterViewInit {
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
