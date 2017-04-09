declare var $;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';

@Component({
    selector: 'signin-required-modal',
    templateUrl: 'app/signin-required.modal.html',
    styleUrls: ['app/signin-required.modal.css'],
})
export class SigninRequiredModal implements AfterViewInit {
    private element;

    constructor(private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
    }
}
