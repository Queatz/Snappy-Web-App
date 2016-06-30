import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { RouterConfig, Router, ROUTER_DIRECTIVES, OnActivate, OnDestroy } from '@angular/router';
import { FeedbackModal } from "./feedback.modal";
import { SigninComponent} from "./signin.component";
import { InforService } from './infor.service';

@Component({
	selector: 'app',
	templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css'],
	directives: [ROUTER_DIRECTIVES, SigninComponent, FeedbackModal]
})
export class AppComponent implements OnActivate, AfterViewInit, OnDestroy {
	constructor(private inforService: InforService, element: ElementRef, private router: Router) {
    	this.element = element.nativeElement;
    }

    ngAfterViewInit() {
    	$(this.element).find('.button-collapse').sideNav({
    	    closeOnClick: true
    	});

    	$('.modal-trigger').leanModal();
    	$('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }

    userSignined() {
    	if(this.inforService.getInforUser()) {
    		return true;
        } else {
    	    return false;
    	}
    }

    isActive(route) {
        //return this.router.isRouteActive(this.router.generate(route));
    }

    pageTitle() {
        return this.inforService.getPageTitle();
    }
}
