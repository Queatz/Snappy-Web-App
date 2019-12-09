declare var $: any;
declare var Waves;

import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';

@Component({
    selector: 'gday-modal',
    templateUrl: './gday.modal.html',
    styleUrls: ['./gday.modal.css']
})
export class GdayModal implements AfterViewInit {
    constructor(
        private inforService: InforService,
        private tutorialService: TutorialService,
        private elementRef: ElementRef
    ) {
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.elementRef.nativeElement.querySelector('.modal')).modal();
    }

    getName() {
        if (this.inforService.getInforUser()) {
            return this.inforService.getInforUser().firstName;
        }
    }

    getMe() {
        if (this.inforService.getInforUser()) {
            return this.inforService.getInforUser().googleUrl;
        }
    }

    setTutorial(step: string) {
        this.tutorialService.step = step;
    }
}
