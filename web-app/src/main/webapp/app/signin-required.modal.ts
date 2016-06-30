import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { SigninComponent } from './signin.component';

@Component({
    selector: 'signin-required-modal',
    templateUrl: 'app/signin-required.modal.html',
    styleUrls: ['app/signin-required.modal.css'],
    directives: [SigninComponent]
})
export class SigninRequiredModal implements AfterViewInit {
    constructor(private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }
}
