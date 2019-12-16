declare var Waves: any;
declare var $: any;

import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { TutorialService } from './tutorial.service';
import { Router } from '@angular/router';

/**
 * Earth
 */

@Component({
    selector: 'welcome-modal',
    templateUrl: './welcome.modal.html',
    styleUrls: ['./welcome.modal.css'],
})
export class WelcomeModal implements AfterViewInit {
    private element: HTMLElement;
    public learnMoreAbout: string;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef, private router: Router, public tutorial: TutorialService) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
  }

    show(learnMoreAbout: string) {
        this.learnMoreAbout = learnMoreAbout;
    }

    tryThis() {
        $(this.element).find('#welcomeModal').modal('close');

        switch(this.learnMoreAbout) {
            case 'feedback':
                this.tutorial.set('feedback some');
                this.router.navigate(['/messages']);
                break;
            case 'learn':
                this.tutorial.set('learn some');
                this.router.navigate(['/people']);
                // These are people near by, click on one to learn more about them
                break;
            case 'discover':
                this.tutorial.set('discover some');
                this.router.navigate(['/projects']);
                // Callout: these are projects
                // Callout: it looks like there's no projects nearby. Click here to create one
                break;
            case 'solve':
                this.tutorial.set('solve some');
                this.router.navigate(['/resources']);
                // Where to send
                break;
            case 'earn':
                this.tutorial.set('earn some');
                this.router.navigate(['/']);
                // Callout: sign-in here
                // Callout click here to offer your skills
                break;
            case 'invite':
                this.tutorial.set('invite some');
                this.router.navigate(['/hubs']);
                // Click the invite box
                break;
        }

        this.learnMoreAbout = null;
    }
}
