declare var $;
declare var Waves;

import { Input, Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
    selector: 'info-modal',
    templateUrl: 'app/info.modal.html',
    styleUrls: ['app/info.modal.css']
})
export class InfoModal implements AfterViewInit {
    @Input() text: string;
    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit() {
        Waves.displayEffect();
       $(this.elementRef.nativeElement.querySelector('.modal')).modal();
    }
}
