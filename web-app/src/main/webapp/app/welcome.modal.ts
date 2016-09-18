import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

/**
 * Earth
 */

@Component({
    selector: 'welcome-modal',
    templateUrl: 'app/welcome.modal.html',
    styleUrls: ['app/welcome.modal.css']
})
export class WelcomeModal implements AfterViewInit {
    public learnMoreAbout: string;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    show(learnMoreAbout: string) {
        this.learnMoreAbout = learnMoreAbout;
    }
}
