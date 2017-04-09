declare var $;
declare var _;

import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';

@Component({
	selector: 'app',
	templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
	constructor(private inforService: InforService, element: ElementRef, private router: Router, public tutorial: TutorialService) {
    	this.element = element.nativeElement;
    }

    private element;

    ngAfterViewInit() {
    	let element = $(this.element);

    	element.find('.button-collapse').sideNav({
    	    closeOnClick: true
    	});

    	element.find('.tooltipped').tooltip({delay: 50});

    	if (!this.userSignined()) {
    	    element.find('#welcomeModal').modal('open');
    	}
    }

    ngOnDestroy() {
        let element = $(this.element);
        element.find('.tooltipped').tooltip('remove');
    }

    userSignined() {
    	if(this.inforService.getInforUser()) {
    		return true;
        } else {
    	    return false;
    	}
    }

    signIn() {
        this.tutorial.set('profile is here');
        $(this.element).find('signin .abcRioButtonIcon').click();
    }

    menuTapped() {
        switch(this.tutorial.get()) {
            case 'solve some':
                this.tutorial.set('solve some more');
                break;
            default:
                if (this.tutorial.get()) {
                    this.tutorial.set('');
                }

                break;
        }
    }

    startOver() {
        this.tutorial.set(null);
        $(this.element).find('#welcomeModal').modal('open');
    }

    isActive(route) {
        return _.startsWith(this.router.url, route);
    }

    pageTitle() {
        return this.inforService.getPageTitle();
    }
}
