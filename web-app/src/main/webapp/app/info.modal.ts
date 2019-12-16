declare var $: any;
declare var Waves: any;

import { Input, Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
    selector: 'info-modal',
    templateUrl: './info.modal.html',
    styleUrls: ['./info.modal.css']
})
export class InfoModal implements AfterViewInit {
    @Input() text: string;
    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit() {
        Waves.displayEffect();
       $(this.elementRef.nativeElement.querySelector('.modal')).modal();
    }
}
