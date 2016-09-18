declare var Waves;

import { Component, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';

@Component({
    selector: 'gday-modal',
    templateUrl: 'app/gday.modal.html',
    styleUrls: ['app/gday.modal.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class GdayModal implements AfterViewInit {
    constructor(private inforService: InforService, private tutorialService: TutorialService) {
    }

    ngAfterViewInit() {
        Waves.displayEffect();
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
