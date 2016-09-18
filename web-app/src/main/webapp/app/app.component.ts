import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { RouterConfig, Router, ROUTER_DIRECTIVES, OnDestroy } from '@angular/router';
import { FeedbackModal } from "./feedback.modal";
import { WelcomeModal } from "./welcome.modal";
import { SigninComponent } from "./signin.component";
import { InforService } from './infor.service';

@Component({
	selector: 'app',
	templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css'],
	directives: [ROUTER_DIRECTIVES, SigninComponent, FeedbackModal, WelcomeModal]
})
export class AppComponent implements, AfterViewInit, OnDestroy {
	constructor(private inforService: InforService, element: ElementRef, private router: Router) {
    	this.element = element.nativeElement;
    }

    ngAfterViewInit() {
    	let element = $(this.element);

    	element.find('.button-collapse').sideNav({
    	    closeOnClick: true
    	});

    	element.find('.modal-trigger').leanModal();
    	element.find('.tooltipped').tooltip({delay: 50});

    	if (!this.userSignined()) {
    	    element.find('#welcomeModal').openModal();
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

    isActive(route) {
        return this.router.url.startsWith(route);
    }

    pageTitle() {
        return this.inforService.getPageTitle();
    }
}
